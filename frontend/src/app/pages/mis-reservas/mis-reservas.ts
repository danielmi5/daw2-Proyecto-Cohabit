import { Component, OnInit, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Button } from '../../components/shared/button/button';
import { Card } from '../../components/shared/card/card';
import { ModalReserva } from '../../components/shared/modal-reserva/modal-reserva';
import { TabComponent } from '../../components/shared/tab/tab';
import { ReservaService } from '../../services/reserva.service';
import { RecursoService } from '../../services/recurso.service';
import { GrupoService } from '../../services/grupo.service';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { MiembroGrupoService } from '../../services/miembro-grupo.service';
import { StateService } from '../../services/state.service';
import { RecursoResponse, ReservaResponse, ReservaRequest, ReservaUpdate } from '../../models';

@Component({
  selector: 'app-mis-reservas',
  imports: [CommonModule, Button, Card, ModalReserva, TabComponent],
  templateUrl: './mis-reservas.html',
  styleUrls: ['./mis-reservas.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MisReservas implements OnInit {
  private reservaService = inject(ReservaService);
  private grupoService = inject(GrupoService);
  private authService = inject(AuthService);
  private notificacionService = inject(NotificacionService);
  private miembroGrupoService = inject(MiembroGrupoService);
  private stateService = inject(StateService);
  private router = inject(Router);

  reservas: ReservaResponse[] = [];
  recursos: RecursoResponse[] = [];
  total = 0;
  loading = true;
  error = false;
  errorMessage = '';
  
  grupoId: number | null = null;
  miembroId: number | null = null;

  mostrarModal = false;
  modoEdicion = false;
  reservaSeleccionada: ReservaResponse | null = null;
   
  /**
   * TrackBy function para optimizar rendering de lista
   */
  trackByReservaId(_index: number, reserva: ReservaResponse): number | null | undefined {
    return reserva.id;
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario = this.authService.usuarioDetalles();
    
    if (!usuario?.miembroGrupoId) {
      this.error = true;
      this.errorMessage = 'No perteneces a ningún grupo';
      this.loading = false;
      return;
    }

    this.miembroId = usuario.miembroGrupoId;

    this.miembroGrupoService.get(usuario.miembroGrupoId).subscribe({
      next: (miembro) => {
        this.grupoId = miembro.grupoId || null;
        if (this.grupoId) {
          this.cargarRecursos();
          this.cargarReservas();
        } else {
          this.error = true;
          this.errorMessage = 'No se pudo obtener el ID del grupo';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del miembro:', error);
        this.error = true;
        this.errorMessage = 'Error al cargar los datos del grupo';
        this.loading = false;
      }
    });
  }

  private cargarRecursos(): void {
    if (!this.grupoId) return;

    this.grupoService.getRecursos(this.grupoId).subscribe({
      next: (recursos) => {
        this.recursos = recursos;
      },
      error: (error) => {
        console.error('Error al cargar recursos:', error);
      }
    });
  }

  cargarReservas(): void {
    if (!this.miembroId) {
      this.error = true;
      this.errorMessage = 'No se ha podido identificar al usuario';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = false;

    this.miembroGrupoService.getReservas(this.miembroId).subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.total = reservas.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.error = true;
        this.errorMessage = error.message || 'Error al cargar las reservas';
        this.loading = false;
      }
    });
  }

  getRecursoNombre(recursoId?: number | null): string {
    if (!recursoId) return 'Recurso';
    const recurso = this.recursos.find(r => r.id === recursoId);
    return recurso?.nombre || ('Recurso #' + recursoId);
  }

  crearReserva(): void {
    this.modoEdicion = false;
    this.reservaSeleccionada = null;
    this.mostrarModal = true;
  }

  editarReserva(reserva: ReservaResponse): void {
    this.reservaSeleccionada = reserva;
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.reservaSeleccionada = null;
  }

  guardarReserva(formValue: any): void {
    if (this.modoEdicion && this.reservaSeleccionada?.id) {
      const payload: ReservaUpdate = {
        fecha: formValue.fecha,
        horaInicio: formValue.horaInicio,
        horaFin: formValue.horaFin,
      };
      
      this.reservaService.update(this.reservaSeleccionada.id, payload).subscribe({
        next: () => {
          this.notificacionService.success('Reserva actualizada correctamente');
          this.cerrarModal();
          this.cargarReservas();
        },
        error: (error) => {
          console.error('Error al actualizar reserva:', error);
          this.notificacionService.error(error.mensaje || 'Error al actualizar la reserva');
        }
      });
    } else {
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
  }

  eliminarReserva(reserva: ReservaResponse): void {
    if (!reserva.id) return;
    
    if (confirm(`¿Estás seguro de que deseas eliminar esta reserva?`)) {
      this.reservaService.delete(reserva.id).subscribe({
        next: () => {
          this.notificacionService.success('Reserva eliminada correctamente');
          this.cargarReservas();
        },
        error: (error) => {
          console.error('Error al eliminar reserva:', error);
          this.notificacionService.error(error.mensaje || 'Error al eliminar la reserva');
        }
      });
    }
  }

  retry(): void {
    this.cargarReservas();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
