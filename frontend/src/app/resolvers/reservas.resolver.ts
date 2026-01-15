import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ApiListResponse, ReservaResponse } from '../models';
import { ReservaService } from '../services/reserva.service';

/**
 * Interfaz para los datos resueltos por el ReservasResolver
 */
export interface ReservasResolverData {
  reservas: ApiListResponse<ReservaResponse> | null;
  error: boolean;
  errorMessage?: string;
}

/**
 * Resolver que obtiene las reservas antes de activar el componente.
 * En caso de error, retorna un objeto con información del error
 * para que el componente pueda manejarlo apropiadamente.
 */
export const reservasResolver: ResolveFn<ReservasResolverData> = (route, state) => {
  const reservaService = inject(ReservaService);
  const router = inject(Router);

  // Obtener parámetros de paginación desde query params
  const page = Number(route.queryParams['page']) || 0;
  const size = Number(route.queryParams['size']) || 10;

  return reservaService.getAll(page, size).pipe(
    map(reservas => ({
      reservas,
      error: false
    })),
    catchError(error => {
      console.error('Error al cargar reservas:', error);
      
      // Devuelve objeto con información del error
      // No se redirige para permitir que el componente muestre un mensaje
      return of({
        reservas: null,
        error: true,
        errorMessage: error?.message || 'Error al cargar las reservas. Por favor, intenta nuevamente.'
      });
    })
  );
};
