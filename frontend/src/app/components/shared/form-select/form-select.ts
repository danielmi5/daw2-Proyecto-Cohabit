import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelect),
      multi: true
    }
  ]
})
export class FormSelect implements ControlValueAccessor {
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
  @Input() opciones?: Array<{ value: string; label: string }>;

  // ControlValueAccessor
  valor: any = '';
  alCambiar: (value: any) => void = () => {};
  alTocar: () => void = () => {};

  writeValue(value: any): void {
    this.valor = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.alCambiar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.alTocar = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.desactivado = isDisabled;
  }

  onChange(event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    this.valor = elemento.value;
    this.alCambiar(this.valor);
  }

  onBlur(): void {
    this.alTocar();
  }
}
