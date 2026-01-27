import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoRecurso } from '../../../models/backend-types';

// Badge visual para estado del recurso (disponible, ocupado, en mantenimiento, fuera de servicio)
@Component({
  selector: 'app-etiqueta-recurso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etiqueta-recurso.html',
  styleUrls: ['./etiqueta-recurso.scss'],
})
export class EtiquetaRecurso {
  @Input() estado?: EstadoRecurso | string;

  obtenerClase(): string {
    switch (this.estado) {
      case 'DISPONIBLE':
        return 'disponible';
      case 'OCUPADO':
        return 'ocupado';
      case 'EN_MANTENIMIENTO':
        return 'mantenimiento';
      case 'FUERA_DE_SERVICIO':
        return 'fuera-servicio';
      default:
        return 'disponible';
    }
  }

  /**
   * Obtiene el texto legible para mostrar en la etiqueta.
   * 
   * @returns El texto formateado del estado en español.
   * 
   * @remarks
   * Mapeo de textos:
   * - DISPONIBLE → "Disponible"
   * - OCUPADO → "Ocupado"
   * - EN_MANTENIMIENTO → "En mantenimiento"
   * - FUERA_DE_SERVICIO → "Fuera de servicio"
   * 
   * Si el estado no es reconocido, retorna "Disponible" como texto por defecto.
   */
  obtenerTexto(): string {
    switch (this.estado) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'OCUPADO':
        return 'Ocupado';
      case 'EN_MANTENIMIENTO':
        return 'En mantenimiento';
      case 'FUERA_DE_SERVICIO':
        return 'Fuera de servicio';
      default:
        return 'Disponible';
    }
  }
}
