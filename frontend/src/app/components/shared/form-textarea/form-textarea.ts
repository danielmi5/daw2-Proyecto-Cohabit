import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type EstadoValidacion = "inicial" | "advertencia" | "error" | "exito";

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

  writeValue(value: any): void {
    this.valor = value || "";
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.desactivado = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.valor = target.value;
    this.onChange(this.valor);
  }

  onInputBlur(): void {
    this.onTouched();
  }
}
