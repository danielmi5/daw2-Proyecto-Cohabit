import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificacionService = inject<NotificacionService>(NotificacionService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje = "Error inesperado. Inténtalo de nuevo más tarde.";

      if (error.status === 0) {
        mensaje = "No hay conexión con el servidor.";
      } else if (error.status === 401) {
        mensaje = "Sesión no válida. Vuelve a iniciar sesión.";
      } else if (error.status === 403) {
        mensaje = "No tienes permisos para realizar esta acción.";
      } else if (error.status === 404) {
        mensaje = "Página no encontrada.";
      } else if (error.status >= 500) {
        mensaje = "Error interno del servidor.";
      }

      notificacionService.error(mensaje);

      return throwError(() => error);
    })
  );
};