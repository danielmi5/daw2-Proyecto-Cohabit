import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

/**
 * Componente de paginación clásica con navegación numerada.
 * Muestra un rango inteligente de páginas cuando hay muchas páginas disponibles.
 * Usa señales (Signals) para gestión reactiva del estado.
 * 
 * @example
 * ```html
 * <app-paginador
 *   [totalElementos]="100"
 *   [tamanoPagina]="10"
 *   [paginaActual]="0"
 *   (cambioPagina)="alCambiarPagina($event)">
 * </app-paginador>
 * ```
 */
@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [FeatherIconDirective],
  templateUrl: './paginador.html',
  styleUrls: ['./paginador.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Paginador {
  /** Número total de elementos en la colección */
  totalElementos = input.required<number>();
  
  /** Número de elementos por página */
  tamanoPagina = input<number>(10);
  
  /** Índice de la página actual (base 0) */
  paginaActual = input.required<number>();
  
  /** Evento emitido cuando cambia la página */
  cambioPagina = output<number>();

  /** Calcula el número total de páginas */
  totalPaginas = computed(() => {
    const total = this.totalElementos();
    const tamano = this.tamanoPagina();
    return Math.ceil(total / tamano);
  });

  /** Indica si hay una página anterior disponible */
  tienePaginaAnterior = computed(() => this.paginaActual() > 0);

  /** Indica si hay una página siguiente disponible */
  tienePaginaSiguiente = computed(() => this.paginaActual() < this.totalPaginas() - 1);

  /**
   * Genera el rango inteligente de páginas a mostrar.
   * Muestra un rango limitado cuando hay muchas páginas.
   * 
   * Lógica:
   * - Si hay 7 páginas o menos: muestra todas
   * - Si estamos en las primeras 4: muestra [1,2,3,4,5 ... última]
   * - Si estamos en las últimas 4: muestra [1 ... n-4,n-3,n-2,n-1,n]
   * - Si estamos en medio: muestra [1 ... actual-1,actual,actual+1 ... última]
   */
  paginasVisibles = computed(() => {
    const total = this.totalPaginas();
    const actual = this.paginaActual();
    const paginas: Array<number | 'ellipsis'> = [];

    if (total <= 7) {
      // Mostrar todas las páginas
      for (let i = 0; i < total; i++) {
        paginas.push(i);
      }
      return paginas;
    }

    // Siempre mostrar primera página
    paginas.push(0);

    if (actual <= 3) {
      // Estamos cerca del inicio
      for (let i = 1; i <= 4; i++) {
        paginas.push(i);
      }
      paginas.push('ellipsis');
      paginas.push(total - 1);
    } else if (actual >= total - 4) {
      // Estamos cerca del final
      paginas.push('ellipsis');
      for (let i = total - 5; i < total; i++) {
        paginas.push(i);
      }
    } else {
      // Estamos en medio
      paginas.push('ellipsis');
      for (let i = actual - 1; i <= actual + 1; i++) {
        paginas.push(i);
      }
      paginas.push('ellipsis');
      paginas.push(total - 1);
    }

    return paginas;
  });

  /**
   * Navega a una página específica
   * @param pagina - Índice de la página destino (base 0)
   */
  irAPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas()) {
      this.cambioPagina.emit(pagina);
    }
  }

  /**
   * Navega a la página anterior
   */
  paginaAnterior(): void {
    if (this.tienePaginaAnterior()) {
      this.cambioPagina.emit(this.paginaActual() - 1);
    }
  }

  /**
   * Navega a la página siguiente
   */
  paginaSiguiente(): void {
    if (this.tienePaginaSiguiente()) {
      this.cambioPagina.emit(this.paginaActual() + 1);
    }
  }

  /**
   * Verifica si una página es la actual
   * @param pagina - Índice de la página a verificar
   * @returns true si es la página actual
   */
  esPaginaActual(pagina: number): boolean {
    return pagina === this.paginaActual();
  }
}
