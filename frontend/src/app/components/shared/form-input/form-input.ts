import { Component, Input, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

export type EstadoValidacion = 'inicial' | 'advertencia' | 'error' | 'exito';

// Input con validación visual (inicial/advertencia/error/exito), iconos y modo password toggle. ControlValueAccessor
@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [ReactiveFormsModule, FeatherIconDirective],
  templateUrl: './form-input.html',
  styleUrls: ['./form-input.scss'],
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
  /** Valor mínimo para input type="date", "time", "number" */
  @Input() min?: string;
  /** Valor máximo para input type="date", "time", "number" */
  @Input() max?: string;

  /** Tipo de input actual mostrado (puede cambiar para password/text toggle) */
  displayTipo: string = 'text';

  /**
   * Inicializa el tipo de input al cargar el componente.
   */
  ngOnInit(): void {
    this.displayTipo = this.tipo || 'text';
  }

  /**
   * Actualiza displayTipo cuando cambia el Input tipo.
   * 
   * @param changes - Cambios detectados en las propiedades Input
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipo'] && !changes['tipo'].firstChange) {
      this.displayTipo = changes['tipo'].currentValue || 'text';
    }
  }

  /**
   * Alterna entre mostrar y ocultar la contraseña.
   * 
   * @remarks
   * Cambia displayTipo entre 'password' y 'text'.
   */
  toggleMostrarContrasena(): void {
    if (!this.displayTipo) this.displayTipo = this.tipo || 'text';
    this.displayTipo = this.displayTipo === 'password' ? 'text' : 'password';
  }

  /**
   * Obtiene el icono a mostrar a la derecha del campo.
   * 
   * @returns Nombre del icono Feather o null si no hay icono
   * 
   * @remarks
   * Prioriza iconoDerecha si está definido, sino muestra icono según estado de validación.
   */
  getIconoDerechaEfectivo(): string | null {
    if (this.iconoDerecha) return this.iconoDerecha;
    const estado = this.getEstadoEfectivo();
    if (estado === 'exito') return 'check';
    if (estado === 'error') return 'alert-circle';
    if (estado === 'advertencia') return 'alert-triangle';
    return null;
  }

  /**
   * Obtiene el icono del botón de mostrar/ocultar contraseña.
   * 
   * @returns 'eye' si la contraseña está oculta, 'eye-off' si está visible
   */
  getIconoMostrarContrasena(): string {
    return this.displayTipo === 'password' ? 'eye' : 'eye-off';
  }

  /**
   * Determina el estado efectivo de validación.
   * 
   * @returns Estado de validación actual
   * 
   * @remarks
   * Prioriza estadoValidacion si está definido, sino usa hayError/exito para compatibilidad con versiones anteriores.
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

  /** Valor actual del campo */
  valor: string = '';
  /** Callback para notificar cambios al FormControl */
  onChange: any = () => {};
  /** Callback para notificar que el campo fue tocado */
  onTouched: any = () => {};

  /**
   * Escribe un valor en el campo (parte de ControlValueAccessor).
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
   * Establece el estado de deshabilitación del campo.
   * 
   * @param isDisabled - true para deshabilitar, false para habilitar
   */
  setDisabledState(isDisabled: boolean): void {
    this.desactivado = isDisabled;
  }

  /**
   * Maneja el evento input del campo.
   * 
   * @param event - Evento input del navegador
   */
  onInput(event: Event): void {
    const elementoInput = event.target as HTMLInputElement;
    this.valor = elementoInput.value;
    this.onChange(this.valor);
  }

  /**
   * Maneja el evento blur del campo.
   */
  onBlur(): void {
    this.onTouched();
  }
}
