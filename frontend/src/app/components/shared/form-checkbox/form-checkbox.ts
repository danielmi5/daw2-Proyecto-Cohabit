import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-form-checkbox',
  imports: [],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
})
export class FormCheckbox {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() etiqueta: string = '';
  @Input() requerido: boolean = false;
  @Input() desactivado: boolean = false;
  @Input() checked: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  @ViewChild('checkboxInput', { static: false }) checkboxInput?: ElementRef<HTMLInputElement>;

  onNativeChange(evento: Event) {
    const checkbox = evento.target as HTMLInputElement;
    this.checked = !!checkbox.checked;
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
      this.checkboxInput.nativeElement.checked = this.checked;
    }

    this.checkedChange.emit(this.checked);
  }
}
