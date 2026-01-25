import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';
import { ApiListResponse, RecursoResponse, RecursoRequest, RecursoUpdate, ReservaResponse } from '../models';
import { ApiService } from './api.service';
import { StateService } from './state.service';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class RecursoService {
  private readonly base = '/api/recursos';
  private api = inject(ApiService);
  private state = inject(StateService);

  get(id: number): Observable<RecursoResponse> {
    return this.api.get<RecursoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

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

  create(payload: RecursoRequest): Observable<RecursoResponse> {
    return this.api.post<RecursoResponse>(this.base, payload).pipe(
      tap(() => this.state.notifyRecursosChanged()),
      catchError(error => this.handleError(error))
    );
  }

  update(id: number, payload: RecursoUpdate): Observable<RecursoResponse> {
    return this.api.put<RecursoResponse>(`${this.base}/${id}`, payload).pipe(
      tap(() => this.state.notifyRecursosChanged()),
      catchError(error => this.handleError(error))
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this.state.notifyRecursosChanged()),
      catchError(error => this.handleError(error))
    );
  }

  getReservas(id: number): Observable<ReservaResponse[]> {
    return this.api.get<ReservaResponse[]>(`${this.base}/${id}/reservas`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }
}
