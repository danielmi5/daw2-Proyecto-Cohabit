import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecursoResponse, ReservaResponse } from '../../../models';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

// Interfaz recurso + próxima reserva
interface RecursoConReserva {
  recurso: RecursoResponse;
  proximaReserva: ReservaResponse | null;
}

// Muestra estado actual del recurso (ocupado/disponible) y hora de disponibilidad
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

  /**
   * Obtiene el texto descriptivo de la próxima reserva.
   * 
   * @returns Mensaje indicando disponibilidad o ausencia de reservas
   */
  getTextoProximaReserva(): string {
    if (!this.recursoInfo.proximaReserva) {
      return 'No hay reservas hoy';
    }
    const reserva = this.recursoInfo.proximaReserva;
    return `Disponible a las ${this.formatHora(reserva.horaFin || '')}`;
  }

  /**
   * Formatea una hora al formato HH:MM.
   * 
   * @param hora - Hora en formato string
   * @returns Hora formateada o mensaje por defecto
   */
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
