import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FeatherIconDirective],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  @Input() titulo: string = 'Recurso';
  @Input() estado: string = 'Estado';
  @Input() fecha: string | Date | null = null;
  @Input() hora: string | null = null;
  @Input() autor: string = '';
  @Input() variante: 'vertical' | 'horizontal' = 'vertical';
  @Input() imagen?: string | null = null;
  @Input() imagenAlt: string = 'Imagen del recurso';
  @Input() mostrarAcciones: boolean = false;

  @Output() editar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<void>();

  onEditar(): void {
    this.editar.emit();
  }

  onEliminar(): void {
    this.eliminar.emit();
  }

  /**
   * Formatea una cadena de hora o un rango de horas para mostrar solo HH:MM
   * Ejemplos:
   * - "19:00:00.000" -> "19:00"
   * - "19:00:00.000 - 23:45:00.000" -> "19:00 - 23:45"
   */
  formatHora(value: string | null | undefined): string {
    if (!value || value.trim() === '' || value.trim() === '-') return 'Sin especificar';
    const str = String(value).trim();
    // Reemplaza cualquier patrón HH:MM:SS(.mmm)? por HH:MM
    return str.replace(/(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?/g, '$1:$2');
  }
}
