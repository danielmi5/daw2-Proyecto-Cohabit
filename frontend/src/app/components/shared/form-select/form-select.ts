import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Select con opciones dinámicas y validación. ControlValueAccessor
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
  /** Identificador único del select */
  @Input() id: string = '';
  /** Atributo name del select HTML */
  @Input() name: string = '';
  /** Etiqueta descriptiva del campo */
  @Input() etiqueta: string = '';
  /** Indica si el campo es obligatorio (muestra asterisco) */
  @Input() requerido: boolean = false;
  /** Texto de ayuda adicional debajo del campo */
  @Input() textoAyuda?: string;
  /** Deshabilita el select */
  @Input() desactivado: boolean = false;
  /** Indica si hay error de validación */
  @Input() hayError: boolean = false;
  /** Mensaje de error a mostrar cuando hayError es true */
  @Input() mensajeError?: string;
  /** Mensaje de éxito a mostrar cuando exito es true */
  @Input() mensajeExito?: string;
  /** Indica si la validación fue exitosa */
  @Input() exito: boolean = false;
  /** Array de opciones con value y label */
  @Input() opciones?: Array<{ value: string; label: string }>;

  /** Valor actual del select */
  valor: any = '';
  /** Callback para notificar cambios al FormControl */
  onChange: any = () => {};
  /** Callback para notificar que el campo fue tocado */
  onTouched: any = () => {};

  /**
   * Escribe un valor en el select (parte de ControlValueAccessor).
   * 
   * @param value - Valor a establecer
   */
  writeValue(value: any): void {
    this.valor = value || '';
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
   * Establece el estado de deshabilitación del select.
   * 
   * @param isDisabled - true para deshabilitar, false para habilitar
   */
  setDisabledState(isDisabled: boolean): void {
    this.desactivado = isDisabled;
  }

  /**
   * Maneja el cambio de selección.
   * 
   * @param event - Evento change del select
   */
  onSelectChange(event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    this.valor = elemento.value;
    this.onChange(this.valor);
  }

  /**
   * Maneja el evento blur del select.
   */
  onBlur(): void {
    this.onTouched();
  }
}
