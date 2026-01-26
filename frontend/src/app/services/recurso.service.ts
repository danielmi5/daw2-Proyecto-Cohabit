import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { ApiListResponse, RecursoResponse, RecursoRequest, RecursoUpdate, ReservaResponse } from '../models';
import { ApiService } from './api.service';
import { StateService } from './state.service';
import { handleHttpError } from './error-handler.util';

/**
 * Servicio para gestionar operaciones CRUD de recursos compartidos.
 * Utiliza StateService para notificar cambios reactivos en la UI.
 * Proporciona métodos para administrar recursos y sus reservas asociadas.
 */
@Injectable({ providedIn: 'root' })
export class RecursoService {
  /**
   * Ruta base del endpoint de recursos en la API
   * @private
   * @readonly
   */
  private readonly base = '/api/recursos';
  
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
   * Obtiene un recurso por su ID
   * @param id - Identificador único del recurso
   * @returns Observable con los datos del recurso
   * @public
   */
  get(id: number): Observable<RecursoResponse> {
    return this.api.get<RecursoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

  /**
   * Obtiene una lista paginada de recursos con filtros opcionales
   * @param page - Número de página (basado en 0)
   * @param size - Tamaño de página
   * @param filtros - Filtros opcionales (grupoId, tipo, estado, disponibilidad por fecha/hora)
   * @returns Observable con la lista paginada de recursos
   * @public
   */
  getAll(
    page = 0,
    size = 10,
    filtros?: { grupoId?: number; tipo?: string; estado?: string; fecha?: string; horaInicio?: string; horaFin?: string }
  ): Observable<ApiListResponse<RecursoResponse>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (filtros?.grupoId) params = params.set('grupoId', String(filtros.grupoId));
    if (filtros?.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros?.horaInicio) params = params.set('horaInicio', filtros.horaInicio);
    if (filtros?.horaFin) params = params.set('horaFin', filtros.horaFin);

    const endpoint = filtros ? `${this.base}/buscar` : this.base;

    return this.api.get<import('../models').BackendPage<RecursoResponse>>(endpoint, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content, total: res.totalElements })),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Crea un nuevo recurso.
   * Notifica el cambio al StateService para actualizaciones reactivas.
   * @param payload - Datos del recurso a crear
   * @returns Observable con el recurso creado
   * @public
   */
  create(payload: RecursoRequest): Observable<RecursoResponse> {
    return this.api.post<RecursoResponse>(this.base, payload).pipe(
      tap(() => this.state.notifyRecursosChanged()),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Actualiza un recurso existente.
   * Notifica el cambio al StateService para actualizaciones reactivas.
   * @param id - ID del recurso a actualizar
   * @param payload - Datos a actualizar del recurso
   * @returns Observable con el recurso actualizado
   * @public
   */
  update(id: number, payload: RecursoUpdate): Observable<RecursoResponse> {
    return this.api.put<RecursoResponse>(`${this.base}/${id}`, payload).pipe(
      tap(() => this.state.notifyRecursosChanged()),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Elimina un recurso por su ID.
   * Notifica el cambio al StateService para actualizaciones reactivas.
   * @param id - ID del recurso a eliminar
   * @returns Observable que completa cuando la eliminación es exitosa
   * @public
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this.state.notifyRecursosChanged()),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Obtiene todas las reservas asociadas a un recurso
   * @param id - ID del recurso
   * @returns Observable con el array de reservas del recurso
   * @public
   */
  getReservas(id: number): Observable<ReservaResponse[]> {
    return this.api.get<ReservaResponse[]>(`${this.base}/${id}/reservas`).pipe(retry(2), catchError(error => this.handleError(error)));
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
