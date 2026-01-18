import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoRecurso } from '../../../models/backend-types';

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
