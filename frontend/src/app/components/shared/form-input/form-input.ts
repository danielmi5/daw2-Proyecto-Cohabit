import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-input',
  imports: [],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput {
  @Input() tipo: string = 'text';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() etiqueta: string = '';
  @Input() placeholder: string = '';
  @Input() requerido: boolean = false;
  @Input() textoAyuda?: string;
  @Input() mensajeError?: string;
  @Input() hayError: boolean = false;
  @Input() iconoIzquierda?: string;
  @Input() iconoDerecha?: string;
}
