import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChildren, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule, RouterLink, FeatherIconDirective],
  templateUrl: './tab.html',
  styleUrls: ['./tab.scss']
})
export class TabComponent implements AfterViewInit, OnChanges {
  @Input() tipo: 'reservas' | 'mis-reservas' = 'reservas';

  // Referencias a los elementos que actúan como pestañas en la plantilla
  @ViewChildren('pestana', { read: ElementRef }) elementosPestana!: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {}

  /**
   * Se ejecuta después de que la vista se inicializa.
   * Actualiza los `tabindex` para que solo la pestaña seleccionada sea tabbable.
   */
  ngAfterViewInit(): void {
    this.actualizarTabindex();
  }

  /**
   * Detecta cambios en las entradas del componente (`@Input`).
   * Si cambia `tipo`, se actualizan los `tabindex` tras la actualización de la vista.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipo']) {
      Promise.resolve().then(() => this.actualizarTabindex());
    }
  }

  /**
   * Recorre las pestañas y asigna `tabindex="0"` a la seleccionada
   * y `tabindex="-1"` al resto para mantener un comportamiento accesible.
   */
  private actualizarTabindex(): void {
    const elementos = this.elementosPestana.toArray();
    if (!elementos.length) return;

    const indiceSeleccionado = elementos.findIndex(e => e.nativeElement.getAttribute('aria-selected') === 'true');

    elementos.forEach((el, idx) => {
      const nodo = el.nativeElement as HTMLElement;
      this.renderer.setAttribute(nodo, 'tabindex', (idx === indiceSeleccionado ? '0' : '-1'));
    });
  }

  /**
   * Maneja eventos de teclado sobre una pestaña.
   * Soporta ArrowRight/ArrowLeft/Home/End para mover el foco,
   * y Enter/Space para activar (simular click) la pestaña.
   */
  manejarTecla(event: KeyboardEvent): void {
    const elementos = this.elementosPestana.toArray();
    if (!elementos.length) return;

    const indiceActual = elementos.findIndex(i => i.nativeElement === event.currentTarget);
    if (indiceActual === -1) return;

    let indiceDestino = -1;

    switch (event.key) {
      case 'ArrowRight':
      case 'Right':
        indiceDestino = (indiceActual + 1) % elementos.length;
        break;
      case 'ArrowLeft':
      case 'Left':
        indiceDestino = (indiceActual - 1 + elementos.length) % elementos.length;
        break;
      case 'Home':
        indiceDestino = 0;
        break;
      case 'End':
        indiceDestino = elementos.length - 1;
        break;
      case 'Enter':
      case ' ': // Space
        event.preventDefault();
        (event.currentTarget as HTMLElement).click();
        return;
      default:
        return;
    }

    if (indiceDestino >= 0) {
      event.preventDefault();
      this.enfocarPestana(indiceDestino);
    }
  }

  /**
   * Establece `tabindex` apropiados y mueve el foco a la pestaña indicada.
   */
  private enfocarPestana(indice: number): void {
    const elementos = this.elementosPestana.toArray();
    elementos.forEach((el, i) => {
      const nodo = el.nativeElement as HTMLElement;
      this.renderer.setAttribute(nodo, 'tabindex', (i === indice ? '0' : '-1'));
    });

    const objetivo = elementos[indice];
    if (objetivo) {
      (objetivo.nativeElement as HTMLElement).focus();
    }
  }
}

