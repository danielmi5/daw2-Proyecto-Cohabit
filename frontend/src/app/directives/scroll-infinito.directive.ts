import { Directive, ElementRef, OnDestroy, OnInit, output, inject } from '@angular/core';

/**
 * Directiva que detecta cuando el elemento host entra en el viewport.
 * Utiliza IntersectionObserver para detectar visibilidad de manera eficiente.
 * Ideal para implementar scroll infinito en listas paginadas.
 * 
 * @example
 * ```html
 * <div class="espaciador" appScrollInfinito (alHacerScroll)="cargarMasDatos()"></div>
 * ```
 * 
 * Uso típico:
 * Coloca un elemento al final de tu lista y aplica esta directiva.
 * Cuando el elemento se vuelve visible (al hacer scroll), emite el evento.
 */
@Directive({
  selector: '[appScrollInfinito]',
  standalone: true
})
export class ScrollInfinitoDirective implements OnInit, OnDestroy {
  /** Elemento host de la directiva */
  private elementRef = inject(ElementRef);

  /** Observer para detectar intersección con viewport */
  private observer: IntersectionObserver | null = null;

  /** Evento emitido cuando el elemento entra en el viewport */
  alHacerScroll = output<void>();

  /**
   * Inicializa el IntersectionObserver al montar la directiva
   */
  ngOnInit(): void {
    this.inicializarObserver();
  }

  /**
   * Limpia el observer al destruir la directiva
   */
  ngOnDestroy(): void {
    this.desconectarObserver();
  }

  /**
   * Configura el IntersectionObserver con opciones apropiadas.
   * 
   * Opciones:
   * - root: null (usa el viewport como contenedor)
   * - rootMargin: '100px' (trigger cuando falta 100px para entrar)
   * - threshold: 0.1 (trigger cuando 10% del elemento es visible)
   */
  private inicializarObserver(): void {
    const opciones: IntersectionObserverInit = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        // Solo emite cuando el elemento se vuelve visible
        if (entrada.isIntersecting) {
          this.alHacerScroll.emit();
        }
      });
    }, opciones);

    // Comienza a observar el elemento host
    this.observer.observe(this.elementRef.nativeElement);
  }

  /**
   * Desconecta y limpia el observer
   */
  private desconectarObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
