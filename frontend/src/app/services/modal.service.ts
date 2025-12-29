import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  abierto = signal(false);
  variante = signal<'pedirAuth'|'salirAuth'|undefined>(undefined);

  private resolverSalida: ((valor: boolean) => void) | undefined;
  private urlRetorno: string | undefined;

  mostrarPedirAuth(url?: string): void {
    this.urlRetorno = url;
    this.variante.set('pedirAuth');
    this.abierto.set(true);
  }

  confirmarSalir(): Promise<boolean> {
    this.variante.set('salirAuth');
    this.abierto.set(true);
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
    this.urlRetorno = undefined;
  }

  obtenerUrlRetorno(): string | undefined {
    return this.urlRetorno;
  }
}
