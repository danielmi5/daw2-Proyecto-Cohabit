import { Injectable, signal } from '@angular/core';

export interface Notificacion {
  id: number;
  type: 'exito' | 'error' | 'warning' | 'info';
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private contadorId = 0;
  readonly notificaciones = signal<Notificacion[]>([]);

  private mostrar(type: Notificacion['type'], mensaje: string): void {
    const notificacion: Notificacion = {
      id: this.contadorId++,
      type,
      mensaje
    };

    // Evita duplicados
    // Si ya existe una notificación del mismo tipo y mensaje, no se añade.
    // Si existe una notificación del mismo tipo pero con mensaje distinto, eliminarla y añadir la nueva.
    this.notificaciones.update(actual => {
      if (actual.some(n => n.type === type && n.mensaje === mensaje)) return actual;
      const sinMismoTipo = actual.filter(n => n.type !== type);
      return sinMismoTipo.concat(notificacion);
    });

    // Se auto elimina después de 5 segundos
    setTimeout(() => this.eliminar(notificacion.id), 5000);
  }

  eliminar(id: number): void {
    this.notificaciones.update(actual => actual.filter(n => n.id !== id));
  }

  success(mensaje: string): void {
    this.mostrar('exito', mensaje);
  }

  error(mensaje: string): void {
    this.mostrar('error', mensaje);
  }

  warning(mensaje: string): void {
    this.mostrar('warning', mensaje);
  }

  info(mensaje: string): void {
    this.mostrar('info', mensaje);
  }
}
