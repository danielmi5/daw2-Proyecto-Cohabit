import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RedireccionService {
  private urlAVolver: string | undefined;

  setUrlAVolver(url?: string): void {
    this.urlAVolver = url;
  }

  obtenerUrlAVolver(): string | undefined {
    return this.urlAVolver;
  }

  limpiarUrlAVolver(): void {
    this.urlAVolver = undefined;
  }
}
