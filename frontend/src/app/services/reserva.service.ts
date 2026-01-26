import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { ApiListResponse, ReservaResponse, ReservaRequest, ReservaUpdate, UsuarioResponse } from '../models';
import { ApiService } from './api.service';
import { StateService } from './state.service';
import { handleHttpError } from './error-handler.util';

/**
 * Servicio para gestionar operaciones CRUD de reservas de recursos.
 * Utiliza StateService para notificar cambios reactivos en la UI.
 * Proporciona métodos para administrar reservas y consultar sus autores.
 */
@Injectable({ providedIn: 'root' })
export class ReservaService {
  /**
   * Ruta base del endpoint de reservas en la API
   * @private
   * @readonly
   */
  private readonly base = '/api/reservas';
  
  /**
   * Servicio de API inyectado mediante inject()
   * @private
   */
  private api = inject(ApiService);
  
  /**
   * Servicio de estado reactivo inyectado mediante inject()
   * @private
   */
  private state = inject(StateService);

  /**
   * Obtiene una reserva por su ID
   * @param id - Identificador único de la reserva
   * @returns Observable con los datos de la reserva
   * @public
   */
  get(id: number): Observable<ReservaResponse> {
    return this.api.get<ReservaResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

  /**
   * Obtiene una lista paginada de reservas con filtros opcionales
   * @param page - Número de página (basado en 0)
   * @param size - Tamaño de página
   * @param filtros - Filtros opcionales (recursoId, usuarioId, fecha, estado)
   * @returns Observable con la lista paginada de reservas
   * @public
   */
  getAll(page = 0, size = 10, filtros?: { recursoId?: number; usuarioId?: number; fecha?: string; estado?: string }): Observable<ApiListResponse<ReservaResponse>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (filtros?.recursoId) params = params.set('recursoId', String(filtros.recursoId));
    if (filtros?.usuarioId) params = params.set('usuarioId', String(filtros.usuarioId));
    if (filtros?.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros?.estado) params = params.set('estado', filtros.estado);

    const endpoint = filtros ? `${this.base}/buscar` : this.base;

    return this.api.get<import('../models').BackendPage<ReservaResponse>>(endpoint, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content, total: res.totalElements })),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Crea una nueva reserva.
   * Notifica el cambio al StateService para actualizaciones reactivas.
   * @param payload - Datos de la reserva a crear
   * @returns Observable con la reserva creada
   * @public
   */
  create(payload: ReservaRequest): Observable<ReservaResponse> {
    return this.api.post<ReservaResponse>(this.base, payload).pipe(
      tap(() => this.state.notifyReservasChanged()),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Actualiza una reserva existente.
   * Notifica el cambio al StateService para actualizaciones reactivas.
   * @param id - ID de la reserva a actualizar
   * @param payload - Datos a actualizar de la reserva
   * @returns Observable con la reserva actualizada
   * @public
   */
  update(id: number, payload: ReservaUpdate): Observable<ReservaResponse> {
    return this.api.put<ReservaResponse>(`${this.base}/${id}`, payload).pipe(
      tap(() => this.state.notifyReservasChanged()),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Elimina una reserva por su ID.
   * Notifica el cambio al StateService para actualizaciones reactivas.
   * @param id - ID de la reserva a eliminar
   * @returns Observable que completa cuando la eliminación es exitosa
   * @public
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this.state.notifyReservasChanged()),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Obtiene el autor (usuario) de una reserva
   * @param id - ID de la reserva
   * @returns Observable con los datos del usuario autor de la reserva
   * @public
   */
  getAutor(id: number): Observable<UsuarioResponse> {
    return this.api.get<UsuarioResponse>(`${this.base}/${id}/autor`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

  /**
   * Maneja errores HTTP
   * @param error - Error capturado
   * @returns Observable que lanza el error procesado
   * @private
   */
  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }
}
