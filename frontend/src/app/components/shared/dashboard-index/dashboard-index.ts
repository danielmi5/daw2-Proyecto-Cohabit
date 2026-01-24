import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { ReservaService } from '../../../services/reserva.service';
import { RecursoService } from '../../../services/recurso.service';
import { GrupoService } from '../../../services/grupo.service';
import { MiembroGrupoService } from '../../../services/miembro-grupo.service';
import { AuthService } from '../../../services/auth.service';
import { ReservaResponse, RecursoResponse, UsuarioResponse } from '../../../models';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { TablaReservas } from '../tabla-reservas/tabla-reservas';
import { RecursoEstado } from '../recurso-estado/recurso-estado';

interface EstadisticasDashboard {
  totalReservas: number;
  recursosOcupados: number;
  recursosLibres: number;
}

interface RecursoConReserva {
  recurso: RecursoResponse;
  proximaReserva: ReservaResponse | null;
}

@Component({
  selector: 'app-dashboard-index',
  standalone: true,
  imports: [CommonModule, FeatherIconDirective, TablaReservas, RecursoEstado],
  templateUrl: './dashboard-index.html',
  styleUrls: ['./dashboard-index.scss']
})
export class DashboardIndex implements OnInit {
  private reservaService = inject(ReservaService);
  private recursoService = inject(RecursoService);
  private grupoService = inject(GrupoService);
  private miembroGrupoService = inject(MiembroGrupoService);
  private authService = inject(AuthService);

  // Estado de carga
  cargando = signal(true);
  error = signal<string | null>(null);

  // Datos del dashboard
  estadisticas = signal<EstadisticasDashboard>({
    totalReservas: 0,
    recursosOcupados: 0,
    recursosLibres: 0
  });

  recursos = signal<RecursoConReserva[]>([]);

  ultimasReservas = signal<(ReservaResponse & { autor?: UsuarioResponse; nombreRecurso?: string })[]>([]);

  private grupoId: number | null = null;

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario = this.authService.usuarioDetalles();
    
    if (!usuario?.miembroGrupoId) {
      this.error.set('No perteneces a ningún grupo');
      this.cargando.set(false);
      return;
    }

    this.miembroGrupoService.get(usuario.miembroGrupoId).subscribe({
      next: (miembro) => {
        this.grupoId = miembro.grupoId || null;
        if (this.grupoId) {
          this.cargarDatosDashboard();
        } else {
          this.error.set('No se pudo obtener el ID del grupo');
          this.cargando.set(false);
        }
      },
      error: (err) => {
        console.error('Error al cargar datos del miembro:', err);
        this.error.set('Error al cargar los datos del grupo');
        this.cargando.set(false);
      }
    });
  }

  cargarDatosDashboard(): void {
    if (!this.grupoId) {
      this.error.set('No se ha podido identificar el grupo');
      this.cargando.set(false);
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    // Cargar recursos del grupo usando el mismo método que la página de recursos
    this.grupoService.getRecursos(this.grupoId).subscribe({
      next: (recursos) => {
        if (recursos.length === 0) {
          this.estadisticas.set({
            totalReservas: 0,
            recursosOcupados: 0,
            recursosLibres: 0
          });
          this.recursos.set([]);
          this.ultimasReservas.set([]);
          this.cargando.set(false);
          return;
        }

        // Cargar todas las reservas de todos los recursos (mismo patrón que página reservas)
        const reservasObservables = recursos
          .filter(recurso => recurso.id !== null && recurso.id !== undefined)
          .map(recurso => this.recursoService.getReservas(recurso.id!));

        forkJoin(reservasObservables).subscribe({
          next: (reservasArrays) => {
            const todasReservas = reservasArrays.flat();
            
            // Calcular estadísticas
            this.calcularEstadisticas(todasReservas, recursos);
            
            // Procesar recursos con sus próximas reservas
            this.procesarRecursosConReservas(recursos, todasReservas);
            
            // Procesar últimas 4 reservas
            this.procesarUltimasReservas(todasReservas.slice(0, 4), recursos);
          },
          error: (err) => {
            console.error('Error al cargar reservas:', err);
            this.error.set('Error al cargar las reservas');
            this.cargando.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar recursos:', err);
        this.error.set('Error al cargar los recursos');
        this.cargando.set(false);
      }
    });
  }

  private calcularEstadisticas(reservas: ReservaResponse[], recursos: RecursoResponse[]): void {
    const hoy = new Date().toISOString().split('T')[0];
    const recursosConReservaHoy = new Set<number>();

    reservas.forEach(reserva => {
      if (reserva.fecha === hoy && reserva.estado !== 'CANCELADA') {
        if (reserva.recursoId) {
          recursosConReservaHoy.add(reserva.recursoId);
        }
      }
    });

    this.estadisticas.set({
      totalReservas: reservas.length,
      recursosOcupados: recursosConReservaHoy.size,
      recursosLibres: Math.max(0, recursos.length - recursosConReservaHoy.size)
    });
  }

  private procesarRecursosConReservas(recursos: RecursoResponse[], todasReservas: ReservaResponse[]): void {
    const hoy = new Date().toISOString().split('T')[0];
    const ahora = new Date();
    const horaActual = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;

    const recursosConInfo: RecursoConReserva[] = recursos.slice(0, 5).map(recurso => {
      // Buscar reserva activa de hoy para este recurso
      const reservasRecurso = todasReservas.filter(r => r.recursoId === recurso.id);
      const reservaHoy = reservasRecurso.find(r => 
        r.fecha === hoy && 
        r.estado !== 'CANCELADA' &&
        (r.horaFin || '') > horaActual
      );

      return { 
        recurso, 
        proximaReserva: reservaHoy || null 
      };
    });

    this.recursos.set(recursosConInfo);
  }

  private procesarUltimasReservas(reservas: ReservaResponse[], recursos: RecursoResponse[]): void {
    if (reservas.length === 0) {
      this.ultimasReservas.set([]);
      this.cargando.set(false);
      return;
    }

    const reservasConInfo: (ReservaResponse & { autor?: UsuarioResponse; nombreRecurso?: string })[] = reservas.map(reserva => {
      const recurso = recursos.find(r => r.id === reserva.recursoId);
      return {
        ...reserva,
        nombreRecurso: recurso?.nombre || 'Desconocido'
      };
    });

    // Cargar autores (mismo patrón que página reservas)
    const autoresObservables = reservas
      .filter(r => r.id != null)
      .map(r => this.reservaService.getAutor(r.id!));

    if (autoresObservables.length === 0) {
      this.ultimasReservas.set(reservasConInfo);
      this.cargando.set(false);
      return;
    }

    forkJoin(autoresObservables).subscribe({
      next: (autores) => {
        autores.forEach((autor, index) => {
          reservasConInfo[index].autor = autor;
        });
        this.ultimasReservas.set(reservasConInfo);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar autores:', err);
        // Mostrar reservas sin autores si falla
        this.ultimasReservas.set(reservasConInfo);
        this.cargando.set(false);
      }
    });
  }

  reintentar(): void {
    this.cargarDatosUsuario();
  }
}

