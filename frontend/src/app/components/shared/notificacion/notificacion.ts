import { Component, inject } from '@angular/core';
import { NotificacionService } from '../../../services/notificacion.service';
import { Alert } from '../alert/alert';

// Contenedor de notificaciones toast. Renderiza alertas del NotificacionService con animaciones
// Se coloca en el layout principal (app.component) con posicionamiento absoluto (esquina superior derecha)
@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [Alert],
  templateUrl: './notificacion.html',
  styleUrls: ['./notificacion.scss'],
})
export class Notificacion {
  protected notificacionService = inject(NotificacionService);

  onCerrar(id: number, elementoWrapper: HTMLElement | any): void {
    const elementoHTML: HTMLElement | null = elementoWrapper && elementoWrapper instanceof HTMLElement ? elementoWrapper : (elementoWrapper?.nativeElement ?? null);
    if (!elementoHTML) {
      this.notificacionService.eliminar(id);
      return;
    }

    // Añade clase que inicia la animación de salida
    elementoHTML.classList.add('salida');

    // Cuando termine la animación, se elimina la notificación
    elementoHTML.addEventListener('animationend', () => {
      this.notificacionService.eliminar(id);
    }, { once: true });
  }
}
