import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecursoResponse, ReservaResponse } from '../../../models';
import { RecursoEstado } from '../recurso-estado/recurso-estado';
import { Button } from '../button/button';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

// Interfaz recurso + próxima reserva
interface RecursoConReserva {
  recurso: RecursoResponse;
  proximaReserva: ReservaResponse | null;
}

// Carrusel paginado de recursos con navegación por teclado y accesibilidad WCAG 2.1 AA.
// Muestra 5 cards en escritorio, 3 en tablet y 2 en móvil.
@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule, RecursoEstado, FeatherIconDirective, Button],
  templateUrl: './carrusel.html',
  styleUrls: ['./carrusel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carrusel implements OnChanges {
  /** Lista de recursos con información de reserva a mostrar en el carrusel */
  @Input() recursos: RecursoConReserva[] = [];

  /** Índice del primer recurso visible en la página actual */
  currentIndex = 0;

  /** Número de elementos visibles según el viewport */
  visibles = 5;

  /** Mensaje para la región aria-live (lectores de pantalla) */
  mensajeAccesible = '';

  /** Página actual del carrusel */
  paginaActual = 1;

  /** Total de páginas del carrusel */
  totalPaginas = 1;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recursos']) {
      this.currentIndex = 0;
      this.actualizarVisibles();
      this.actualizarIndicadores();
      this.actualizarMensaje();
      this.cdr.markForCheck();
    }
  }

  /** Escucha cambios de tamaño del viewport para ajustar items visibles */
  @HostListener('window:resize')
  onResize(): void {
    this.actualizarVisibles();
    this.actualizarIndicadores();
    this.cdr.markForCheck();
  }

  /** Calcula cuántos items mostrar según el ancho de la ventana */
  private actualizarVisibles(): void {
    const ancho = window.innerWidth;
    if (ancho < 320) {
      this.visibles = 1;
    } else if (ancho < 768) {
      this.visibles = 2;
    } else if (ancho < 1024) {
      this.visibles = 3;
    } else {
      this.visibles = 5;
    }
    // Asegurar que el índice no quede fuera de rango tras el redimensionado
    if (this.currentIndex + this.visibles > this.recursos.length) {
      this.currentIndex = Math.max(0, this.recursos.length - this.visibles);
    }
  }

  /** Índice (1-based) del primer recurso visible */
  get primerVisible(): number {
    return this.currentIndex + 1;
  }

  /** Índice (1-based) del último recurso visible */
  get ultimoVisible(): number {
    return Math.min(this.currentIndex + this.visibles, this.recursos.length);
  }

  /** ¿Mostrar botones de navegación? Solo si hay más recursos que los visibles */
  get mostrarBotones(): boolean {
    return this.recursos.length > this.visibles;
  }

  /** ¿Se puede navegar hacia atrás? */
  get puedeRetroceder(): boolean {
    return this.currentIndex > 0;
  }

  /** ¿Se puede navegar hacia adelante? */
  get puedeAvanzar(): boolean {
    return this.currentIndex + this.visibles < this.recursos.length;
  }

  /** Recursos actualmente visibles en la página (paginado por slice) */
  get recursosVisibles(): RecursoConReserva[] {
    return this.recursos.slice(this.currentIndex, this.currentIndex + this.visibles);
  }

  /** Navega a la página anterior de recursos */
  navegarAnterior(): void {
    if (!this.puedeRetroceder) return;
    this.currentIndex = Math.max(0, this.currentIndex - this.visibles);
    this.actualizarIndicadores();
    this.actualizarMensaje();
    this.cdr.markForCheck();
  }

  /** Navega a la página siguiente de recursos */
  navegarSiguiente(): void {
    if (!this.puedeAvanzar) return;
    this.currentIndex = Math.min(
      this.recursos.length - this.visibles,
      this.currentIndex + this.visibles
    );
    this.actualizarIndicadores();
    this.actualizarMensaje();
    this.cdr.markForCheck();
  }

  /** Navegación por teclado: flechas izquierda/derecha */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.navegarAnterior();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.navegarSiguiente();
    }
  }

  /** Actualiza el mensaje accesible para lectores de pantalla */
  private actualizarMensaje(): void {
    if (this.recursos.length === 0) {
      this.mensajeAccesible = 'No hay recursos disponibles.';
      return;
    }
    this.mensajeAccesible =
      `Mostrando recursos ${this.primerVisible} a ${this.ultimoVisible} de ${this.recursos.length}`;
  }

  /** Genera la etiqueta aria descriptiva para cada card de recurso */
  obtenerAriaLabel(recursoInfo: RecursoConReserva): string {
    const nombre = recursoInfo.recurso.nombre || 'Sin nombre';
    const estado = recursoInfo.proximaReserva ? 'Ocupado' : 'Disponible';
    const textoReserva = recursoInfo.proximaReserva 
      ? `disponible a las ${recursoInfo.proximaReserva.horaFin || 'sin especificar'}`
      : 'sin reservas hoy';
    return `${nombre}, ${estado}, ${textoReserva}`;
  }

  /** Label dinámico del grupo visible */
  get ariaLabelGrupo(): string {
    if (this.recursos.length === 0) return 'No hay recursos para mostrar';
    return `Mostrando recursos ${this.primerVisible} a ${this.ultimoVisible} de ${this.recursos.length}`;
  }

  /** Actualiza los indicadores de página */
  private actualizarIndicadores(): void {
    this.totalPaginas = Math.max(1, Math.ceil(this.recursos.length / this.visibles));

    if (this.currentIndex + this.visibles >= this.recursos.length) {
      this.paginaActual = this.totalPaginas;
    } else {
      this.paginaActual = Math.floor(this.currentIndex / this.visibles) + 1;
    }
  }
}
