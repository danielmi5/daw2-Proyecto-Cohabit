import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../directives/feather-icon.directive';
import { Card } from '../../components/shared/card/card';
import { Button } from '../../components/shared/button/button';
import { ModalReserva } from '../../components/shared/modal-reserva/modal-reserva';
import { ReservaService } from '../../services/reserva.service';
import { RecursoService } from '../../services/recurso.service';
import { RecursoResponse } from '../../models';
import { ReservaResponse, ReservaRequest } from '../../models';

import { TabComponent } from '../../components/shared/tab/tab';

@Component({
  selector: 'app-mis-reservas',
  imports: [CommonModule, Card, Button, ModalReserva, TabComponent],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.scss',
})
export class MisReservas implements OnInit {
  reservas: ReservaResponse[] = [];
  total = 0;
  loading = true;
  error = false;
  errorMessage = '';
  recursos: RecursoResponse[] = [];
  
  mostrarFormulario = false;
  modoEdicion = false;
  reservaEditando: ReservaResponse | null = null;

  constructor(
    private reservaService: ReservaService,
    private recursoService: RecursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRecursos();
    this.cargarReservas();
  }

  private cargarRecursos(): void {
    this.recursoService.getAll(0, 200).subscribe({
      next: (data) => {
        this.recursos = data.items;
      },
      error: (err) => {
        console.warn('No se pudieron cargar recursos:', err);
      }
    });
  }

  getRecursoNombre(recursoId?: number | null): string {
    if (!recursoId) return 'Recurso';
    const recurso = this.recursos.find(r => r.id === recursoId);
    return recurso?.nombre || ('Recurso #' + recursoId);
  }

  cargarReservas(): void {
    this.loading = true;
    this.error = false;
    
    // Obtener todas las reservas del usuario actual (filtro por usuarioId se manejará en el backend)
    this.reservaService.getAll(0, 100).subscribe({
      next: (data) => {
        this.reservas = data.items;
        this.total = data.total;
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.errorMessage = 'Error al cargar las reservas. Por favor, intenta de nuevo.';
        this.loading = false;
        console.error('Error al cargar reservas:', err);
      }
    });
  }

  abrirFormularioNuevo(): void {
    this.modoEdicion = false;
    this.reservaEditando = null;
    this.mostrarFormulario = true;
  }

  abrirFormularioEditar(reserva: ReservaResponse): void {
    this.modoEdicion = true;
    this.reservaEditando = reserva;
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.reservaEditando = null;
  }

  guardarReserva(formValue: any): void {
    if (this.modoEdicion && this.reservaEditando?.id) {
      // Editar reserva existente
      const payload = {
        fecha: formValue.fecha,
        horaInicio: formValue.horaInicio,
        horaFin: formValue.horaFin,
        recursoId: formValue.recursoId,
      };
      
      this.reservaService.update(this.reservaEditando.id, payload).subscribe({
        next: () => {
          this.cerrarFormulario();
          this.cargarReservas();
        },
        error: (err) => {
          console.error('Error al actualizar reserva:', err);
          alert('Error al actualizar la reserva');
        }
      });
    } else {
      // Crear nueva reserva
      const payload: ReservaRequest = {
        fecha: formValue.fecha,
        horaInicio: formValue.horaInicio,
        horaFin: formValue.horaFin,
        recursoId: formValue.recursoId,
        miembroGrupoId: 1, // TODO: Obtener del contexto del usuario
        estado: 'PENDIENTE',
      };
      
      this.reservaService.create(payload).subscribe({
        next: () => {
          this.cerrarFormulario();
          this.cargarReservas();
        },
        error: (err) => {
          console.error('Error al crear reserva:', err);
          alert('Error al crear la reserva');
        }
      });
    }
  }

  eliminarReserva(reserva: ReservaResponse): void {
    if (!reserva.id) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      this.reservaService.delete(reserva.id).subscribe({
        next: () => {
          this.cargarReservas();
        },
        error: (err) => {
          console.error('Error al eliminar reserva:', err);
          alert('Error al eliminar la reserva');
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
