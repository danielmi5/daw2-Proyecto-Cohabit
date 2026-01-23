import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecursoResponse, ReservaResponse } from '../../../models';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

interface RecursoConReserva {
  recurso: RecursoResponse;
  proximaReserva: ReservaResponse | null;
}

@Component({
  selector: 'app-recurso-estado',
  standalone: true,
  imports: [CommonModule, FeatherIconDirective],
  templateUrl: './recurso-estado.html',
  styleUrls: ['./recurso-estado.scss']
})
export class RecursoEstado {
  @Input() recursoInfo!: RecursoConReserva;

  getEstadoRecurso(): 'Ocupado' | 'Disponible' {
    return this.recursoInfo.proximaReserva ? 'Ocupado' : 'Disponible';
  }

  getTextoProximaReserva(): string {
    if (!this.recursoInfo.proximaReserva) {
      return 'No hay reservas hoy';
    }
    const reserva = this.recursoInfo.proximaReserva;
    return `Disponible a las ${this.formatHora(reserva.horaFin || '')}`;
  }

  private formatHora(hora: string): string {
    if (!hora || hora === '-') return 'Sin especificar';
    // Asegurar formato HH:MM
    const match = hora.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const [, h, m] = match;
      return `${h.padStart(2, '0')}:${m}`;
    }
    return hora;
  }
}
