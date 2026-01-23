import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaResponse, UsuarioResponse } from '../../../models';

@Component({
  selector: 'app-tabla-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-reservas.html',
  styleUrls: ['./tabla-reservas.scss']
})
export class TablaReservas {
  @Input() reservas: (ReservaResponse & { autor?: UsuarioResponse; nombreRecurso?: string })[] = [];

  formatHora(hora: string): string {
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
