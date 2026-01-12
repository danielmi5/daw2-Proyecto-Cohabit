import { Component, Input, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { AccordionItem } from './accordion-item';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule, FeatherIconDirective, AccordionItem],
  templateUrl: './accordion.html',
  styleUrls: ['./accordion.scss'],
})
export class Accordion implements AfterContentInit {
  @Input() modo: 'accordion' | 'independence' = 'accordion';
  @ContentChildren(AccordionItem) items!: QueryList<AccordionItem>;

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

  private cerrarOtrosItems(currentIndex: number) {
    this.items.forEach((item, index) => {
      if (index !== currentIndex && item.estaAbierto) {
        item.cerrar();
      }
    });
  }
}
