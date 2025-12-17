import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type EstadoValidacion = 'inicial' | 'advertencia' | 'error' | 'exito';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true
    }
  ]
})
export class FormInput implements ControlValueAccessor {
  @Input() tipo: string = 'text';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() etiqueta: string = '';
  @Input() placeholder: string = '';
  @Input() requerido: boolean = false;
  @Input() textoAyuda?: string;
  @Input() mensajeError?: string;
  @Input() mensajeExito?: string;
  @Input() mensajeAdvertencia?: string;
  @Input() estadoValidacion: EstadoValidacion = 'inicial';
  @Input() hayError: boolean = false;
  @Input() exito: boolean = false;
  @Input() desactivado: boolean = false;
  @Input() iconoIzquierda?: string;
  @Input() iconoDerecha?: string;

  /**
   * Determina el estado efectivo de validación.
   * Prioriza estadoValidacion si está definido, sino usa hayError/exito para compatibilidad.
   */
  getEstadoEfectivo(): EstadoValidacion {
    if (this.estadoValidacion !== 'inicial') {
      return this.estadoValidacion;
    }
    // Compatibilidad con hayError/exito
    if (this.hayError) return 'error';
    if (this.exito) return 'exito';
    return 'inicial';
  }

  // ControlValueAccessor
  valor: string = '';
  alCambiar: (value: string) => void = () => {};
  alTocar: () => void = () => {};

  writeValue(value: string): void {
    this.valor = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.alCambiar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.alTocar = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.desactivado = isDisabled;
  }

  onInput(event: Event): void {
    const elementoInput = event.target as HTMLInputElement;
    this.valor = elementoInput.value;
    this.alCambiar(this.valor);
  }

  onBlur(): void {
    this.alTocar();
  }
}
