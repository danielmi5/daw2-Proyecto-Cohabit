import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, of } from 'rxjs';
import { inject } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';
import { Router } from '@angular/router';
import { clasificarErrorHttp } from '../../services/error-handler.util';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificacionService = inject<NotificacionService>(NotificacionService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const detalle = clasificarErrorHttp(error);

      // Notificación global para errores de red y servidor
      if (detalle.tipo === 'red') {
        notificacionService.error(detalle.mensaje);

      } else if (detalle.tipo === 'servidor') {
        notificacionService.error(detalle.mensaje);

      } else if (detalle.tipo === 'cliente') {
        notificacionService.error(detalle.mensaje);

      } else if (detalle.tipo === 'validacion') {
        notificacionService.warning(detalle.mensaje);
      } else {
        notificacionService.error(detalle.mensaje);
      }

      // Manejo específico para auth
      if (detalle.status === 401) {
        router.navigate(['/login']);
      }

      return throwError(() => detalle);
    })
  );
};