import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterContentInit, ContentChildren, QueryList, forwardRef, inject, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

// Checkbox con proyección de contenido (ng-content) para etiquetas con enlaces. ControlValueAccessor
@Component({
  selector: 'app-form-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-checkbox.html',
  styleUrls: ['./form-checkbox.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckbox),
      multi: true
    }
  ]
})
export class FormCheckbox implements ControlValueAccessor, AfterContentInit {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() etiqueta: string = '';
  @Input() requerido: boolean = false;
  @Input() desactivado: boolean = false;
  @Input() checked: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  @ViewChild('checkboxInput', { static: false }) checkboxInput?: ElementRef<HTMLInputElement>;

  private renderer = inject(Renderer2);

  @ContentChildren('*', { read: ElementRef }) elementosProyectados?: QueryList<ElementRef>;

  tieneProyectado: boolean = false;

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  /**
   * Verifica si hay contenido proyectado después de inicializar la vista.
   */
  ngAfterContentInit() {
    this.tieneProyectado = !!(this.elementosProyectados && this.elementosProyectados.length > 0);
  }

  /**
   * Escribe un valor en el checkbox (parte de ControlValueAccessor).
   * 
   * @param value - Valor booleano a establecer
   */
  writeValue(value: boolean): void {
    this.checked = !!value;
    if (this.checkboxInput?.nativeElement) {
      try {
        this.renderer.setProperty(this.checkboxInput.nativeElement, 'checked', this.checked);
      } catch {
        this.checkboxInput.nativeElement.checked = this.checked;
      }
    }
  }

  /**
   * Registra la función callback para cambios de valor.
   * 
   * @param fn - Función a llamar cuando el valor cambie
   */
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  /**
   * Registra la función callback para el evento touched.
   * 
   * @param fn - Función a llamar cuando el campo sea tocado
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Establece el estado de deshabilitación del checkbox.
   * 
   * @param isDisabled - true para deshabilitar, false para habilitar
   */
  setDisabledState(isDisabled: boolean): void {
    this.desactivado = isDisabled;
  }

  /**
   * Maneja el cambio del checkbox nativo.
   * 
   * @param evento - Evento change del input checkbox
   */
  onNativeChange(evento: Event) {
    const casilla = evento.target as HTMLInputElement;
    this.checked = !!casilla.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
  }

  /**
   * Maneja el clic en la etiqueta visual del checkbox.
   * 
   * @param evento - Evento click del mouse
   * 
   * @remarks
   * Previene el comportamiento por defecto y sincroniza manualmente el estado.
   */
  onVisualClick(evento: MouseEvent) {
    if (this.desactivado) {
      evento.preventDefault();
      evento.stopPropagation();
      return;
    }

    // Previen el click por defecto
    evento.preventDefault();
    evento.stopPropagation();

    this.checked = !this.checked;

    // Actualiza el estado del checkbox
    if (this.checkboxInput && this.checkboxInput.nativeElement) {
      try {
        this.renderer.setProperty(this.checkboxInput.nativeElement, 'checked', this.checked);
      } catch {
        this.checkboxInput.nativeElement.checked = this.checked;
      }
    }

    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
  }
}
