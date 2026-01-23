import { Component, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

export type EstadoValidacion = 'inicial' | 'advertencia' | 'error' | 'exito';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [ReactiveFormsModule, FeatherIconDirective],
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
[x: string]: any;
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
  @Input() min?: string; // Para input type="date", "time", "number"
  @Input() max?: string; // Para input type="date", "time", "number"

  // Estado para mostrar/ocultar contraseña en el input
  displayTipo: string = 'text';

  ngOnInit(): void {
    this.displayTipo = this.tipo || 'text';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipo'] && !changes['tipo'].firstChange) {
      this.displayTipo = changes['tipo'].currentValue || 'text';
    }
  }

  toggleMostrarContrasena(): void {
    if (!this.displayTipo) this.displayTipo = this.tipo || 'text';
    this.displayTipo = this.displayTipo === 'password' ? 'text' : 'password';
  }

  // Icono derecho (prioriza iconoDerecha si está definido)
  getIconoDerechaEfectivo(): string | null {
    if (this.iconoDerecha) return this.iconoDerecha;
    const estado = this.getEstadoEfectivo();
    if (estado === 'exito') return 'check';
    if (estado === 'error') return 'alert-circle';
    if (estado === 'advertencia') return 'alert-triangle';
    return null;
  }

  // Icono de ojo para contraseña según el displayTipo
  getIconoMostrarContrasena(): string {
    return this.displayTipo === 'password' ? 'eye' : 'eye-off';
  }

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

  onInput(event: Event): void {
    const elementoInput = event.target as HTMLInputElement;
    this.valor = elementoInput.value;
    this.onChange(this.valor);
  }

  onBlur(): void {
    this.onTouched();
  }
}
