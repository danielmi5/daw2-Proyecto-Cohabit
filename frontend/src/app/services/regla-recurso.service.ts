import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, ReglaRecursoResponse, ReglaRecursoRequest, ReglaRecursoUpdate } from '../models';
import { ApiService } from './api.service';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class ReglaRecursoService {
  private readonly base = '/api/reglas';

  constructor(private api: ApiService) {}

  get(id: number): Observable<ReglaRecursoResponse> {
    return this.api.get<ReglaRecursoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(error => this.handleError(error)));
  }

  getAll(page = 0, size = 10, sort?: string): Observable<ApiListResponse<ReglaRecursoResponse>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (sort) params = params.set('sort', sort);

    return this.api.get<import('../models').BackendPage<ReglaRecursoResponse>>(this.base, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content, total: res.totalElements })),
      catchError(error => this.handleError(error))
    );
  }

  create(payload: ReglaRecursoRequest): Observable<ReglaRecursoResponse> {
    return this.api.post<ReglaRecursoResponse>(this.base, payload).pipe(catchError(error => this.handleError(error)));
  }

  update(id: number, payload: ReglaRecursoUpdate): Observable<ReglaRecursoResponse> {
    return this.api.put<ReglaRecursoResponse>(`${this.base}/${id}`, payload).pipe(catchError(error => this.handleError(error)));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }
}
