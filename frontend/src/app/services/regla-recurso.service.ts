import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, ReglaRecursoResponse, ReglaRecursoRequest, ReglaRecursoUpdate } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ReglaRecursoService {
  private readonly base = '/api/reglas';

  constructor(private api: ApiService) {}

  get(id: number): Observable<ReglaRecursoResponse> {
    return this.api.get<ReglaRecursoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getAll(page = 0, size = 10): Observable<ApiListResponse<ReglaRecursoResponse>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.api.get<any>(this.base, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content as ReglaRecursoResponse[], total: res.totalElements as number })),
      catchError(this.handleError)
    );
  }

  create(payload: ReglaRecursoRequest): Observable<ReglaRecursoResponse> {
    return this.api.post<ReglaRecursoResponse>(this.base, payload).pipe(retry(2), catchError(this.handleError));
  }

  update(id: number, payload: ReglaRecursoUpdate): Observable<ReglaRecursoResponse> {
    return this.api.put<ReglaRecursoResponse>(`${this.base}/${id}`, payload).pipe(retry(2), catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('ReglaRecursoService error', error);
    return throwError(() => error);
  }
}
