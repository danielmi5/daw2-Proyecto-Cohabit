import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, RecursoResponse, RecursoRequest, RecursoUpdate } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class RecursoService {
  private readonly base = '/api/recursos';

  constructor(private api: ApiService) {}

  get(id: number): Observable<RecursoResponse> {
    return this.api.get<RecursoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getAll(page = 0, size = 10, filtros?: { grupoId?: number; tipo?: string; estado?: string }): Observable<ApiListResponse<RecursoResponse>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (filtros?.grupoId) params = params.set('grupoId', String(filtros.grupoId));
    if (filtros?.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros?.estado) params = params.set('estado', filtros.estado);

    return this.api.get<any>(this.base, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content as RecursoResponse[], total: res.totalElements as number })),
      catchError(this.handleError)
    );
  }

  create(payload: RecursoRequest): Observable<RecursoResponse> {
    return this.api.post<RecursoResponse>(this.base, payload).pipe(retry(2), catchError(this.handleError));
  }

  update(id: number, payload: RecursoUpdate): Observable<RecursoResponse> {
    return this.api.put<RecursoResponse>(`${this.base}/${id}`, payload).pipe(retry(2), catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('RecursoService error', error);
    return throwError(() => error);
  }
}
