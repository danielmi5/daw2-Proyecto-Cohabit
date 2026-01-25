import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-select.html',
  styleUrls: ['./form-select.scss'],
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
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.valor = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.desactivado = isDisabled;
  }

  onSelectChange(event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    this.valor = elemento.value;
    this.onChange(this.valor);
  }

  onBlur(): void {
    this.onTouched();
  }
}
