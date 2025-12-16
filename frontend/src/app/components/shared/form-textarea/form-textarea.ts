import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-textarea',
  imports: [],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
})
export class FormTextarea {
  @Input() tipo: string = 'text';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() etiqueta: string = '';
  @Input() placeholder: string = '';
  @Input() requerido: boolean = false;
  @Input() textoAyuda?: string;
  @Input() mensajeError?: string;
  @Input() hayError: boolean = false;
  @Input() mensajeExito?: string;
  @Input() exito: boolean = false;
  @Input() desactivado: boolean = false;
  @Input() iconoIzquierda?: string;
  @Input() iconoDerecha?: string;
}
