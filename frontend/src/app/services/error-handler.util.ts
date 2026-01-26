import { Observable, throwError } from 'rxjs';

/**
 * Tipo de error HTTP clasificado
 */
export type TipoError = 'red' | 'servidor' | 'validacion' | 'cliente' | 'desconocido';

/**
 * Interfaz para detalles de error HTTP estructurado
 */
export interface ErrorDetalle {
  /**
   * Tipo de error clasificado
   */
  tipo: TipoError;
  
  /**
   * Código de estado HTTP
   */
  status?: number;
  
  /**
   * Mensaje de error legible
   */
  mensaje: string;
  
  /**
   * Detalles adicionales del error
   */
  detalles?: any;
}

/**
 * Maneja errores HTTP clasificando el tipo de error y retornando un Observable de error estructurado.
 * @param error - Error HTTP capturado
 * @returns Observable que lanza el error clasificado
 */
export function handleHttpError(error: any): Observable<never> {
  const detalle = clasificarErrorHttp(error);
  return throwError(() => detalle);
}

/**
 * Clasifica un error HTTP en categorías manejables.
 * Distingue entre errores de red, servidor, validación, cliente y desconocidos.
 * @param error - Error HTTP a clasificar
 * @returns Objeto ErrorDetalle con información estructurada del error
 */
export function clasificarErrorHttp(error: any): ErrorDetalle {
  let tipo: TipoError = 'desconocido';
  let mensaje = 'Se ha producido un error.';
  let detalles: any = null;
  let status: number | undefined = undefined;

  // Error de red (no hay respuesta)
  if ((error instanceof ProgressEvent) || error.status === 0 || (!error.status && !error.error)) {
    tipo = 'red';
    mensaje = 'Error de red: no se ha podido conectar con el servidor.';
    detalles = error;
  }
  // Errores de servidor (5xx)
  else if (error.status >= 500) {
    tipo = 'servidor';
    status = error.status;
    mensaje = `Error del servidor (${status}). Inténtalo más tarde.`;
    detalles = error.error ?? error;
  }
  // Errores de validación (400)
  else if (error.status === 400) {
    tipo = 'validacion';
    status = 400;
    const body = error.error;
    detalles = body && (body.errors || body.violations || body.fieldErrors || body) ? (body.errors || body.violations || body.fieldErrors || body) : body;
    // Extraer mensaje del backend si está disponible
    mensaje = body?.mensaje || body?.descripcion || 'Error de validación: revisa los datos introducidos.';
  }
  // Errores cliente (4xx distintos de 400)
  else if (error.status >= 400 && error.status < 500) {
    tipo = 'cliente';
    status = error.status;
    // Extraer mensaje del backend (ApiErrorDTO tiene campos: mensaje, descripcion)
    mensaje = error.error?.mensaje || error.error?.descripcion || error.error?.message || `Error de cliente (${status}).`;
    detalles = error.error ?? error;
  }
  // Otros casos
  else {
    if (error && error.message) mensaje = error.message;
    detalles = error;
  }

  console.error('ManejadorHTTP:', { tipo, status, mensaje, detalles });

  const payload: ErrorDetalle = { tipo, status, mensaje, detalles };
  return payload;
}
