import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservaResponse, RecursoResponse, ReservaRequest, UsuarioResponse } from '../../models';
import { Button } from '../../components/shared/button/button';
import { TabComponent } from '../../components/shared/tab/tab';
import { ModalReserva } from '../../components/shared/modal-reserva/modal-reserva';
import { RecursoService } from '../../services/recurso.service';
import { GrupoService } from '../../services/grupo.service';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { MiembroGrupoService } from '../../services/miembro-grupo.service';
import { ReservaService } from '../../services/reserva.service';
import { forkJoin } from 'rxjs';

// Reservas del grupo. Carga recursos y autores en paralelo (forkJoin). Permite crear reservas.
@Component({
  selector: 'app-reservas',
  imports: [CommonModule, Button, TabComponent, ModalReserva],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.scss'],
})
export class Reservas implements OnInit {
  private recursoService = inject(RecursoService);
  private grupoService = inject(GrupoService);
  private authService = inject(AuthService);
  private notificacionService = inject(NotificacionService);
  private miembroGrupoService = inject(MiembroGrupoService);
  private reservaService = inject(ReservaService);
  private router = inject(Router);

  reservas: ReservaResponse[] = [];
  recursos: RecursoResponse[] = [];
  autores: Map<number, UsuarioResponse> = new Map();
  total = 0;
  error = false;
  errorMessage = '';
  loading = signal(true);
  
  grupoId: number | null = null;
  miembroId: number | null = null;

  mostrarModal = false;

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario = this.authService.usuarioDetalles();
    
    if (!usuario?.miembroGrupoId) {
      this.error = true;
      this.errorMessage = 'No perteneces a ningún grupo';
      this.loading.set(false);
      return;
    }

    this.miembroId = usuario.miembroGrupoId;

    this.miembroGrupoService.get(usuario.miembroGrupoId).subscribe({
      next: (miembro) => {
        this.grupoId = miembro.grupoId || null;
        if (this.grupoId) {
          this.cargarReservas();
        } else {
          this.error = true;
          this.errorMessage = 'No se pudo obtener el ID del grupo';
          this.loading.set(false);
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del miembro:', error);
        this.error = true;
        this.errorMessage = 'Error al cargar los datos del grupo';
        this.loading.set(false);
      }
    });
  }

  cargarReservas(): void {
    if (!this.grupoId) {
      this.error = true;
      this.errorMessage = 'No se ha podido identificar el grupo';
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error = false;

    this.grupoService.getRecursos(this.grupoId).subscribe({
      next: (recursos) => {
        this.recursos = recursos;
        
        if (recursos.length === 0) {
          this.reservas = [];
          this.total = 0;
          this.loading.set(false);
          return;
        }

        const reservasObservables = recursos
          .filter(recurso => recurso.id !== null && recurso.id !== undefined)
          .map(recurso => this.recursoService.getReservas(recurso.id!));

        forkJoin(reservasObservables).subscribe({
          next: (reservasArrays) => {
            this.reservas = reservasArrays.flat();
            this.total = this.reservas.length;
            this.cargarAutoresReservas(this.reservas);
          },
          error: (error) => {
            console.error('Error al cargar reservas:', error);
            this.error = true;
            this.errorMessage = error.message || 'Error al cargar las reservas';
            this.loading.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar recursos:', error);
        this.error = true;
        this.errorMessage = error.message || 'Error al cargar los recursos';
        this.loading.set(false);
      }
    });
  }

  private cargarAutoresReservas(reservas: ReservaResponse[]): void {
    if (reservas.length === 0) {
      this.loading.set(false);
      return;
    }

    const autoresObservables = reservas
      .filter(r => r.id != null)
      .map(r => this.reservaService.getAutor(r.id!));

    forkJoin(autoresObservables).subscribe({
      next: (autores) => {
        autores.forEach((autor, index) => {
          const reservaId = reservas[index].id;
          if (reservaId) {
            this.autores.set(reservaId, autor);
          }
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar autores:', error);
        this.loading.set(false);
      }
    });
  }

  getRecursoNombre(recursoId?: number | null): string {
    if (!recursoId) return 'Recurso';
    const recurso = this.recursos.find(r => r.id === recursoId);
    return recurso?.nombre || ('Recurso #' + recursoId);
  }

  getAutorNombre(reservaId?: number | null): string {
    if (!reservaId) return '';
    const autor = this.autores.get(reservaId);
    if (!autor) return '';
    return `${autor.nombre} ${autor.apellidos || ''}`.trim();
  }

  crearReserva(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarReserva(formValue: any): void {
    if (!this.miembroId) {
      this.notificacionService.error('No se pudo identificar al usuario');
      return;
    }

    const payload: ReservaRequest = {
      fecha: formValue.fecha,
      horaInicio: formValue.horaInicio,
      horaFin: formValue.horaFin,
      recursoId: formValue.recursoId,
      miembroGrupoId: this.miembroId,
      estado: 'PENDIENTE',
    };
    
    this.reservaService.create(payload).subscribe({
      next: () => {
        this.notificacionService.success('Reserva creada correctamente');
        this.cerrarModal();
        this.cargarReservas();
      },
      error: (error) => {
        console.error('Error al crear reserva:', error);
        this.notificacionService.error(error.mensaje || 'Error al crear la reserva');
      }
    });
  }

  retry(): void {
    this.cargarReservas();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
