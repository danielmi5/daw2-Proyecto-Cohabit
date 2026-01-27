import { Component, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { AccordionItem } from './accordion-item';

// Contenedor de accordion que maneja múltiples items
// Modo 'accordion': solo uno abierto. Modo 'independence': varios abiertos
@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.html',
  styleUrls: ['./accordion.scss'],
})
export class Accordion implements AfterContentInit {
  @Input() modo: 'accordion' | 'independence' = 'accordion';
  @ContentChildren(AccordionItem) items!: QueryList<AccordionItem>;

  /**
   * Se ejecuta después de inicializar el contenido proyectado.
   * 
   * @remarks
   * En modo accordion, subscribe a los eventos toggle de cada item para cerrar los demás.
   */
  ngAfterContentInit() {
    if (this.modo === 'accordion') {
      this.items.forEach((item, index) => {
        item.itemToggled.subscribe(() => {
          if (item.estaAbierto) {
            this.cerrarOtrosItems(index);
          }
        });
      });
    }
  }

  /**
   * Cierra todos los items excepto el indicado.
   * 
   * @param currentIndex - Índice del item actual que debe permanecer abierto
   */
  private cerrarOtrosItems(currentIndex: number) {
    this.items.forEach((item, index) => {
      if (index !== currentIndex && item.estaAbierto) {
        item.cerrar();
      }
    });
  }
}
