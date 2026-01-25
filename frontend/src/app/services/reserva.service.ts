import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { ApiListResponse, ReservaResponse, ReservaRequest, ReservaUpdate, UsuarioResponse } from '../models';
import { ApiService } from './api.service';
import { StateService } from './state.service';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly base = '/api/reservas';
  private api = inject(ApiService);
  private state = inject(StateService);

  get(id: number): Observable<ReservaResponse> {
    return this.api.get<ReservaResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

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

  create(payload: ReservaRequest): Observable<ReservaResponse> {
    return this.api.post<ReservaResponse>(this.base, payload).pipe(
      tap(() => this.state.notifyReservasChanged()),
      catchError(error => this.handleError(error))
    );
  }

  update(id: number, payload: ReservaUpdate): Observable<ReservaResponse> {
    return this.api.put<ReservaResponse>(`${this.base}/${id}`, payload).pipe(
      tap(() => this.state.notifyReservasChanged()),
      catchError(error => this.handleError(error))
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this.state.notifyReservasChanged()),
      catchError(error => this.handleError(error))
    );
  }

  getAutor(id: number): Observable<UsuarioResponse> {
    return this.api.get<UsuarioResponse>(`${this.base}/${id}/autor`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }
}
