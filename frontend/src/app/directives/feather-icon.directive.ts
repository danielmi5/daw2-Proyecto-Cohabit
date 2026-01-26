import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, OnDestroy } from '@angular/core';
import * as feather from 'feather-icons';

// Directiva standalone para renderizar iconos de Feather Icons como SVG inline.
// Proporciona opciones de personalización de tamaño, color y variantes predefinidas.
//
// Ejemplo:
// <!-- Uso básico -->
// <span [feather]="'sun'"></span>
//
// <!-- Con personalización -->
// <span [feather]="'moon'" [ancho]="24" [alto]="24" [trazo]="'#fff'"></span>
//
// <!-- Con variante predefinida -->
// <span [feather]="'menu'" tipo="header"></span>
//
// Implementa OnChanges para actualización dinámica y OnDestroy para limpieza de recursos.
@Directive({
  selector: '[feather]',
  standalone: true
})
export class FeatherIconDirective implements OnChanges, OnDestroy {
  @Input('feather') nombre!: string; // Nombre del icono (ej: 'sun', 'moon', 'menu')
  @Input() ancho?: string | number;
  @Input() alto?: string | number;
  @Input() trazo?: string; // Color del stroke
  @Input() tipo?: 'header' | 'submenu' | 'botones'; // Variante de estilos

  constructor(private elemento: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  private appendedNode: HTMLElement | null = null; // Nodo SVG insertado

  ngOnChanges(_: SimpleChanges): void {
    this.aplicarTipo();
    this.renderizar();
  }

  /**
   * Aplica la clase CSS y tamaños por defecto según la variante de tipo especificada
   * @private
   */
  private aplicarTipo(): void {
    // Elimina clases anteriores relacionadas con la directiva
    const tipos = ['header', 'submenu', 'botones'];
    tipos.forEach(t => this.renderer.removeClass(this.elemento.nativeElement, `feather--${t}`));

    if (!this.tipo) return;

    // Añadir clase de variante
    this.renderer.addClass(this.elemento.nativeElement, `feather--${this.tipo}`);

    // Si no se han proporcionado ancho/alto explícitos, aplicar tamaños por defecto
    if (!this.ancho && !this.alto) {
      switch (this.tipo) {
        case 'header':
          this.ancho = this.ancho || '36px';
          this.alto = this.alto || '36px';
          break;
        case 'submenu':
          this.ancho = this.ancho || '24px';
          this.alto = this.alto || '24px';
          break;
        case 'botones':
          this.ancho = this.ancho || '20px';
          this.alto = this.alto || '20px';
          break;
      }
    }
  }

  /** Renderiza el SVG del icono solicitado dentro del elemento host. */
  private renderizar(): void {
    // Si no se proporciona nombre, limpiamos el contenido.
    if (!this.nombre) {
      if (this.appendedNode) {
        this.renderer.removeChild(this.elemento.nativeElement, this.appendedNode);
        this.appendedNode = null;
      }
      return;
    }

    // Obtener el icono desde la colección de feather
    const iconos = (feather as any).icons || {};
    const icono = iconos[this.nombre];
    if (!icono) {
      if (this.appendedNode) {
        this.renderer.removeChild(this.elemento.nativeElement, this.appendedNode);
        this.appendedNode = null;
      }
      return;
    }

    // Preparar atributos opcionales para el SVG
    const atributos: any = {};
    if (this.ancho) atributos.width = this.ancho;
    if (this.alto) atributos.height = this.alto;
    if (this.trazo) atributos.stroke = this.trazo;

    // Algunas versiones exponen toSvg en el icono, otras tienen toSvg a nivel superior
    const svg = typeof icono.toSvg === 'function'
      ? icono.toSvg(atributos)
      : (feather as any).toSvg
        ? (feather as any).toSvg(this.nombre, atributos)
        : '';

    // Insertar el SVG generado en el elemento host usando Renderer2
    if (!svg) {
      if (this.appendedNode) {
        this.renderer.removeChild(this.elemento.nativeElement, this.appendedNode);
        this.appendedNode = null;
      }
      return;
    }

    if (this.appendedNode) {
      this.renderer.setProperty(this.appendedNode, 'innerHTML', svg);
    } else {
      const wrapper = this.renderer.createElement('span');
      this.renderer.addClass(wrapper, 'feather-icon');
      this.renderer.setProperty(wrapper, 'innerHTML', svg);
      this.renderer.appendChild(this.elemento.nativeElement, wrapper);
      this.appendedNode = wrapper as HTMLElement;
    }
  }

  ngOnDestroy(): void {
    if (this.appendedNode) {
      try {
        this.renderer.removeChild(this.elemento.nativeElement, this.appendedNode);
      } catch {}
      this.appendedNode = null;
    }
  }
}
