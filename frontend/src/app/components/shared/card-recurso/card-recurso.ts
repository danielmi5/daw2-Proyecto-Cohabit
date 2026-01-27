import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { RecursoResponse } from '../../../models';
import { TipoRecurso, EstadoRecurso } from '../../../models/backend-types';
import { Button } from "../button/button";
import { EtiquetaRecurso } from '../etiqueta-recurso/etiqueta-recurso';

// Card de recurso con etiqueta estado. Emite eventos ver/editar/eliminar. Presenta: nombre, tipo, descripción, imagen
@Component({
  selector: 'app-card-recurso',
  standalone: true,
  imports: [CommonModule, FeatherIconDirective, Button, EtiquetaRecurso],
  templateUrl: './card-recurso.html',
  styleUrls: ['./card-recurso.scss'],
})
export class CardRecurso {
  @Input() recurso!: RecursoResponse;
  @Input() mostrarAcciones: boolean = true;
  @Input() mostrarVer: boolean = true;

  @Output() ver = new EventEmitter<RecursoResponse>();
  @Output() editar = new EventEmitter<RecursoResponse>();
  @Output() eliminar = new EventEmitter<RecursoResponse>();

  /**
   * Maneja el clic en el botón "Ver" y emite el evento correspondiente.
   */
  onVer(): void {
    this.ver.emit(this.recurso);
  }

  /**
   * Maneja el clic en el botón "Editar" y emite el evento correspondiente.
   */
  onEditar(): void {
    this.editar.emit(this.recurso);
  }

  /**
   * Maneja el clic en el botón "Eliminar" y emite el evento correspondiente.
   */
  onEliminar(): void {
    this.eliminar.emit(this.recurso);
  }
}
