import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

// Item de accordion con contenido proyectado
// Genera IDs únicos para ARIA, emite evento al abrir/cerrar
@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule, FeatherIconDirective],
  templateUrl: './accordion-item.html',
  styleUrls: ['./accordion.scss'],
})
export class AccordionItem {
  @Input() titulo: string = '';
  @Input() estaAbierto: boolean = false;
  @Input() deshabilitado: boolean = false;
  @Output() itemToggled = new EventEmitter<void>();

  private static contador: number = 0;
  readonly id: string;
  readonly panelId: string;

  constructor() {
    this.id = `accordion-header-${AccordionItem.contador}`;
    this.panelId = `accordion-panel-${AccordionItem.contador}`;
    AccordionItem.contador++;
  }

  toggle() {
    if (!this.deshabilitado) {
      this.estaAbierto = !this.estaAbierto;
      this.itemToggled.emit();
    }
  }

  cerrar() {
    this.estaAbierto = false;
  }

  /**
   * Abre el item.
   * 
   * @remarks
   * No hace nada si el item está deshabilitado.
   */
  abrir() {
    if (!this.deshabilitado) {
      this.estaAbierto = true;
      this.itemToggled.emit();
    }
  }
}
