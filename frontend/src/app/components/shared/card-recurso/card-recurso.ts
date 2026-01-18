import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { RecursoResponse } from '../../../models';
import { TipoRecurso, EstadoRecurso } from '../../../models/backend-types';
import { Button } from "../button/button";
import { EtiquetaRecurso } from '../etiqueta-recurso/etiqueta-recurso';

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

  onVer(): void {
    this.ver.emit(this.recurso);
  }

  onEditar(): void {
    this.editar.emit(this.recurso);
  }

  onEliminar(): void {
    this.eliminar.emit(this.recurso);
  }
}
