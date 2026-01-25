import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterContentInit, ContentChildren, QueryList, forwardRef, inject, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
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

  /* Lógica de proyección de contenido:
  - `elementosProyectados` recoge los nodos que el componente padre proyecta dentro de este componente (<ng-content>).
  - `tieneProyectado` se usa para saber si mostrar el `etiqueta` por defecto (cuando no hay contenido proyectado) o mostrar lo que haya sido proyectado (por ejemplo enlaces con `routerLink`). */
  @ContentChildren('*', { read: ElementRef }) elementosProyectados?: QueryList<ElementRef>;

  tieneProyectado: boolean = false;

  // ControlValueAccessor
  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  ngAfterContentInit() {
    this.tieneProyectado = !!(this.elementosProyectados && this.elementosProyectados.length > 0);
  }

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

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.desactivado = isDisabled;
  }

  onNativeChange(evento: Event) {
    const casilla = evento.target as HTMLInputElement;
    this.checked = !!casilla.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
  }

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
