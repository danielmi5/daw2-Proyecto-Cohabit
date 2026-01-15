import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, GrupoResponse, GrupoRequest, GrupoUpdate } from '../models';
import { ApiService } from './api.service';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class GrupoService {
  private readonly base = '/api/grupos';

  constructor(private api: ApiService) {}

  get(id: number): Observable<GrupoResponse> {
    return this.api.get<GrupoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

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

  create(payload: GrupoRequest): Observable<GrupoResponse> {
    return this.api.post<GrupoResponse>(this.base, payload).pipe(catchError(error => this.handleError(error)));
  }

  update(id: number, payload: GrupoUpdate): Observable<GrupoResponse> {
    return this.api.put<GrupoResponse>(`${this.base}/${id}`, payload).pipe(catchError(error => this.handleError(error)));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }
}
