import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, UsuarioResponse, UsuarioRequest, UsuarioUpdate } from '../models';
import { ApiService } from './api.service';
import { handleHttpError } from './error-handler.util';

/**
 * Servicio para gestionar operaciones CRUD de usuarios.
 * Proporciona métodos para obtener, crear, actualizar y eliminar usuarios.
 */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  /**
   * Ruta base del endpoint de usuarios en la API
   * @private
   * @readonly
   */
  private readonly base = '/api/usuarios';

  /**
   * Constructor que inyecta el servicio de API
   * @param api - Servicio centralizado para peticiones HTTP
   */
  constructor(private api: ApiService) {}

  /**
   * Obtiene un usuario por su ID
   * @param id - Identificador único del usuario
   * @returns Observable con los datos del usuario
   * @public
   */
  get(id: number): Observable<UsuarioResponse> {
    return this.api.get<UsuarioResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

  /**
   * Obtiene una lista paginada de usuarios
   * @param page - Número de página (basado en 0)
   * @param size - Tamaño de página
   * @param sort - Criterio de ordenación opcional
   * @returns Observable con la lista paginada de usuarios
   * @public
   */
  getAll(page = 0, size = 10, sort?: string): Observable<ApiListResponse<UsuarioResponse>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (sort) params = params.set('sort', sort);

    return this.api.get<import('../models').BackendPage<UsuarioResponse>>(this.base, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content, total: res.totalElements })),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Crea un nuevo usuario
   * @param payload - Datos del usuario a crear
   * @returns Observable con el usuario creado
   * @public
   */
  create(payload: UsuarioRequest): Observable<UsuarioResponse> {
    return this.api.post<UsuarioResponse>(this.base, payload).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Actualiza un usuario existente
   * @param id - ID del usuario a actualizar
   * @param payload - Datos a actualizar del usuario
   * @returns Observable con el usuario actualizado
   * @public
   */
  update(id: number, payload: UsuarioUpdate): Observable<UsuarioResponse> {
    return this.api.put<UsuarioResponse>(`${this.base}/${id}`, payload).pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Elimina un usuario por su ID
   * @param id - ID del usuario a eliminar
   * @returns Observable que completa cuando la eliminación es exitosa
   * @public
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(catchError(error => this.handleError(error)));
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
