import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const tiempoInicial = Date.now();
  console.log(`[HTTP] ${req.method} ${req.urlWithParams}`, req);

  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) {
          const tiempoTranscurrido = Date.now() - tiempoInicial;
          console.log(
            `[HTTP] Respuesta ${req.method} ${req.urlWithParams} ${event.status} (${tiempoTranscurrido} ms)`,
            event.body
          );
        }
      },
      error: err => {
        const tiempoTranscurrido = Date.now() - tiempoInicial;
        console.error(
          `[HTTP] Error ${req.method} ${req.urlWithParams} (${tiempoTranscurrido} ms)`,
          err
        );
      }
    })
  );
};