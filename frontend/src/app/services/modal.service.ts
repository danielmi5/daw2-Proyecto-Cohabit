import { Injectable, signal, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Servicio para gestionar modales globales de la aplicación.
 * Utiliza signals para estado reactivo y Renderer2 para manipulación segura del DOM.
 * 
 * @remarks
 * Variantes de modal soportadas:
 * - pedirAuth: Modal para solicitar autenticación
 * - salirAuth: Modal de confirmación para salir con cambios sin guardar
 * 
 * Características:
 * - Gestión automática de backdrop
 * - Soporte para modales basados en Promises
 * - Estado reactivo con signals
 */
@Injectable({ providedIn: 'root' })
export class ModalService {
  /**
   * Signal que indica si el modal está abierto
   * @public
   */
  abierto = signal(false);
  
  /**
   * Signal con la variante actual del modal
   * @public
   */
  variante = signal<'pedirAuth'|'salirAuth'|undefined>(undefined);

  /**
   * Resolver de la Promise para modales de confirmación
   * @private
   */
  private resolverSalida: ((valor: boolean) => void) | undefined;
  
  /**
   * Renderer2 para crear/remover backdrop del DOM
   * @private
   */
  private renderer!: Renderer2;
  
  /**
   * Referencia al elemento backdrop del modal
   * @private
   */
  private backdropElement: HTMLElement | null = null;

  /**
   * Constructor que inicializa el Renderer2
   * @param rendererFactory - Factory para crear Renderer2
   * @param document - Documento del navegador inyectado
   */
  constructor(rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  
  /**
   * Muestra el modal solicitando autenticación
   * @public
   */
  mostrarPedirAuth(): void {
    this.variante.set('pedirAuth');
    this.abierto.set(true);
    this.addBackdrop();
  }

  /**
   * Muestra el modal de confirmación para salir con cambios sin guardar.
   * Retorna una Promise que se resuelve con true si se confirma, false si se cancela.
   * @returns Promise<boolean> que indica la decisión del usuario
   * @public
   */
  confirmarSalir(): Promise<boolean> {
    this.variante.set('salirAuth');
    this.abierto.set(true);
    this.addBackdrop();
    return new Promise<boolean>((resolve) => {
      this.resolverSalida = resolve;
    });
  }

  /**
   * Confirma la acción del modal y lo cierra
   * @public
   */
  confirmar(): void {
    if (this.resolverSalida) {
      this.resolverSalida(true);
      this.resolverSalida = undefined;
    }
    this.cerrar();
  }

  /**
   * Cancela la acción del modal y lo cierra
   * @public
   */
  cancelar(): void {
    if (this.resolverSalida) {
      this.resolverSalida(false);
      this.resolverSalida = undefined;
    }
    this.cerrar();
  }

  /**
   * Cierra el modal y elimina el backdrop
   * @public
   */
  cerrar(): void {
    this.abierto.set(false);
    this.variante.set(undefined);
    this.removeBackdrop();
  }

  /**
   * Añade el backdrop al DOM
   * @private
   */
  private addBackdrop(): void {
    if (this.backdropElement) return;
    try {
      const overlay = this.renderer.createElement('div');
      this.renderer.addClass(overlay, 'modal-backdrop');
      this.renderer.setAttribute(overlay, 'aria-hidden', 'true');
      this.renderer.appendChild(this.document.body, overlay);
      this.backdropElement = overlay as HTMLElement;
    } catch {}
  }

  /**
   * Elimina el backdrop del DOM
   * @private
   */
  private removeBackdrop(): void {
    if (!this.backdropElement) return;
    try {
      this.renderer.removeChild(this.document.body, this.backdropElement);
    } catch {}
    this.backdropElement = null;
  }
}
