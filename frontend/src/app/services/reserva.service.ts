import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, ReservaResponse, ReservaRequest, ReservaUpdate } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly base = '/api/reservas';

  constructor(private api: ApiService) {}

  get(id: number): Observable<ReservaResponse> {
    return this.api.get<ReservaResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getAll(page = 0, size = 10, filtros?: { recursoId?: number; usuarioId?: number; fecha?: string; estado?: string }): Observable<ApiListResponse<ReservaResponse>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (filtros?.recursoId) params = params.set('recursoId', String(filtros.recursoId));
    if (filtros?.usuarioId) params = params.set('usuarioId', String(filtros.usuarioId));
    if (filtros?.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros?.estado) params = params.set('estado', filtros.estado);

    return this.api.get<any>(this.base, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content as ReservaResponse[], total: res.totalElements as number })),
      catchError(this.handleError)
    );
  }

  create(payload: ReservaRequest): Observable<ReservaResponse> {
    return this.api.post<ReservaResponse>(this.base, payload).pipe(retry(2), catchError(this.handleError));
  }

  update(id: number, payload: ReservaUpdate): Observable<ReservaResponse> {
    return this.api.put<ReservaResponse>(`${this.base}/${id}`, payload).pipe(retry(2), catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('ReservaService error', error);
    return throwError(() => error);
  }
}
