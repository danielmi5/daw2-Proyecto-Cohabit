import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, GrupoResponse, GrupoRequest, GrupoUpdate, RecursoResponse } from '../models';
import { ApiService } from './api.service';
import { handleHttpError } from './error-handler.util';

/**
 * Servicio para gestionar operaciones CRUD de grupos de convivencia.
 * Proporciona métodos para administrar grupos y sus recursos asociados.
 */
@Injectable({ providedIn: 'root' })
export class GrupoService {
  /**
   * Ruta base del endpoint de grupos en la API
   * @private
   * @readonly
   */
  private readonly base = '/api/grupos';

  /**
   * Constructor que inyecta el servicio de API
   * @param api - Servicio centralizado para peticiones HTTP
   */
  constructor(private api: ApiService) {}

  /**
   * Obtiene un grupo por su ID
   * @param id - Identificador único del grupo
   * @returns Observable con los datos del grupo
   * @public
   */
  get(id: number): Observable<GrupoResponse> {
    return this.api.get<GrupoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

  /**
   * Obtiene una lista paginada de grupos con filtros opcionales
   * @param page - Número de página (basado en 0)
   * @param size - Tamaño de página
   * @param sort - Criterio de ordenación opcional
   * @param filtros - Filtros opcionales de búsqueda
   * @returns Observable con la lista paginada de grupos
   * @public
   */
  getAll(page = 0, size = 10, sort?: string, filtros?: { nombre?: string; descripcion?: string; creadorId?: number }): Observable<ApiListResponse<GrupoResponse>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (sort) params = params.set('sort', sort);
    if (filtros?.nombre) params = params.set('nombre', filtros.nombre);
    if (filtros?.descripcion) params = params.set('descripcion', filtros.descripcion);
    if (filtros?.creadorId) params = params.set('creadorId', String(filtros.creadorId));

    const endpoint = filtros ? `${this.base}/buscar` : this.base;

    return this.api.get<import('../models').BackendPage<GrupoResponse>>(endpoint, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content, total: res.totalElements })),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Crea un nuevo grupo
   * @param payload - Datos del grupo a crear
   * @returns Observable con el grupo creado
   * @public
   */
  create(payload: GrupoRequest): Observable<GrupoResponse> {
    return this.api.post<GrupoResponse>(this.base, payload).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Actualiza un grupo existente
   * @param id - ID del grupo a actualizar
   * @param payload - Datos a actualizar del grupo
   * @returns Observable con el grupo actualizado
   * @public
   */
  update(id: number, payload: GrupoUpdate): Observable<GrupoResponse> {
    return this.api.put<GrupoResponse>(`${this.base}/${id}`, payload).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Elimina un grupo por su ID
   * @param id - ID del grupo a eliminar
   * @returns Observable que completa cuando la eliminación es exitosa
   * @public
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Obtiene todos los recursos asociados a un grupo
   * @param id - ID del grupo
   * @returns Observable con el array de recursos del grupo
   * @public
   */
  getRecursos(id: number): Observable<RecursoResponse[]> {
    return this.api.get<any>(`${this.base}/${id}/recursos`).pipe(
      retry(2),
      // La API puede devolver una página (con `content`) o directamente un array.
      map(res => {
        if (Array.isArray(res)) return res as RecursoResponse[];
        if (res && Array.isArray(res.content)) return res.content as RecursoResponse[];
        return [] as RecursoResponse[];
      }),
      catchError(error => this.handleError(error))
    );
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
