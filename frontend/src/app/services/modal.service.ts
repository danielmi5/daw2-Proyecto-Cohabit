import { Injectable, signal, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ModalService {
  abierto = signal(false);
  variante = signal<'pedirAuth'|'salirAuth'|undefined>(undefined);

  private resolverSalida: ((valor: boolean) => void) | undefined;
  // Renderer2 para crear/remover backdrop
  private renderer!: Renderer2;
  private backdropElement: HTMLElement | null = null;

  constructor(rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  
  mostrarPedirAuth(): void {
    this.variante.set('pedirAuth');
    this.abierto.set(true);
    this.addBackdrop();
  }

  confirmarSalir(): Promise<boolean> {
    this.variante.set('salirAuth');
    this.abierto.set(true);
    this.addBackdrop();
    return new Promise<boolean>((resolve) => {
      this.resolverSalida = resolve;
    });
  }

  confirmar(): void {
    if (this.resolverSalida) {
      this.resolverSalida(true);
      this.resolverSalida = undefined;
    }
    this.cerrar();
  }

  cancelar(): void {
    if (this.resolverSalida) {
      this.resolverSalida(false);
      this.resolverSalida = undefined;
    }
    this.cerrar();
  }

  cerrar(): void {
    this.abierto.set(false);
    this.variante.set(undefined);
    this.removeBackdrop();
  }

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

  private removeBackdrop(): void {
    if (!this.backdropElement) return;
    try {
      this.renderer.removeChild(this.document.body, this.backdropElement);
    } catch {}
    this.backdropElement = null;
  }
}
