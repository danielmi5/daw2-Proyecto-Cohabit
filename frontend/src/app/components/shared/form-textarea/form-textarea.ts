import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type EstadoValidacion = "inicial" | "advertencia" | "error" | "exito";

// Textarea con validación y estados visuales. ControlValueAccessor
@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-textarea.html',
  styleUrls: ['./form-textarea.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextarea),
      multi: true
    }
  ]
})
export class FormTextarea implements ControlValueAccessor {
  @Input() name: string = "";
  @Input() id: string = "";
  @Input() etiqueta: string = "";
  @Input() placeholder: string = "";
  @Input() requerido: boolean = false;
  @Input() textoAyuda?: string;
  @Input() mensajeError?: string;
  @Input() mensajeExito?: string;
  @Input() mostrarMensajeExito: boolean = false;
  @Input() mensajeAdvertencia?: string;
  @Input() estadoValidacion: EstadoValidacion = "inicial";
  @Input() hayError: boolean = false;
  @Input() exito: boolean = false;
  @Input() desactivado: boolean = false;
  @Input() iconoIzquierda?: string;
  @Input() iconoDerecha?: string;
  @Input() rows: number = 4;

  valor: string = "";
  onChange: any = () => {};
  onTouched: any = () => {};

  /**
   * Escribe un valor en el textarea (parte de ControlValueAccessor).
   * 
   * @param value - Valor a establecer
   */
  writeValue(value: any): void {
    this.valor = value || "";
  }

  /**
   * Registra la función callback para cambios de valor.
   * 
   * @param fn - Función a llamar cuando el valor cambie
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra la función callback para el evento touched.
   * 
   * @param fn - Función a llamar cuando el campo sea tocado
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Establece el estado de deshabilitación del textarea.
   * 
   * @param isDisabled - true para deshabilitar, false para habilitar
   */
  setDisabledState?(isDisabled: boolean): void {
    this.desactivado = isDisabled;
  }

  /**
   * Maneja el evento input del textarea.
   * 
   * @param event - Evento input del navegador
   */
  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.valor = target.value;
    this.onChange(this.valor);
  }

  /**
   * Maneja el evento blur del textarea.
   */
  onInputBlur(): void {
    this.onTouched();
  }
}
