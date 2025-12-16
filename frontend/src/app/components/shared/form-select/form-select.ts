import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-select',
  imports: [],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
})
export class FormSelect {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() etiqueta: string = '';
  @Input() requerido: boolean = false;
  @Input() textoAyuda?: string;
  @Input() desactivado: boolean = false;
  @Input() hayError: boolean = false;
  @Input() mensajeError?: string;
  @Input() mensajeExito?: string;
  @Input() exito: boolean = false;
  @Input() valorPredeterminado?: string;
  /** Opciones: [{ value: string, label: string }] */
  @Input() opciones?: Array<{ value: string; label: string }>;
}
