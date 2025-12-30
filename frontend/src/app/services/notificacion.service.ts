import { Injectable, signal } from '@angular/core';

export interface Notificacion {
  id: number;
  type: 'exito' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private idCounter = 0;
  readonly notifications = signal<Notificacion[]>([]);

  private show(type: Notificacion['type'], message: string): void {
    const notification: Notificacion = {
      id: this.idCounter++,
      type,
      message
    };

    this.notifications.update(current => [...current, notification]);

    // Auto-remover después de 5 segundos
    setTimeout(() => this.remove(notification.id), 5000);
  }

  remove(id: number): void {
    this.notifications.update(current => current.filter(n => n.id !== id));
  }

  success(message: string): void {
    this.show('exito', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }
}
