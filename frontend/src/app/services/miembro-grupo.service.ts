import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, MiembroGrupoResponse, MiembroGrupoRequest, MiembroGrupoUpdate } from '../models';
import { ApiService } from './api.service';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class MiembroGrupoService {
  private readonly base = '/api/miembros';

  constructor(private api: ApiService) {}

  get(id: number): Observable<MiembroGrupoResponse> {
    return this.api.get<MiembroGrupoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

  getAll(page = 0, size = 10): Observable<ApiListResponse<MiembroGrupoResponse>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.api.get<import('../models').BackendPage<MiembroGrupoResponse>>(this.base, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content, total: res.totalElements })),
      catchError(error => this.handleError(error))
    );
  }

  create(payload: MiembroGrupoRequest): Observable<MiembroGrupoResponse> {
    return this.api.post<MiembroGrupoResponse>(this.base, payload).pipe(catchError(error => this.handleError(error)));
  }

  update(id: number, payload: MiembroGrupoUpdate): Observable<MiembroGrupoResponse> {
    return this.api.put<MiembroGrupoResponse>(`${this.base}/${id}`, payload).pipe(catchError(error => this.handleError(error)));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }
}
