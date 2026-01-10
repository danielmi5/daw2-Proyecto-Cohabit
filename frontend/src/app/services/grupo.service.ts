import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, GrupoResponse, GrupoRequest, GrupoUpdate } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class GrupoService {
  private readonly base = '/api/grupos';

  constructor(private api: ApiService) {}

  get(id: number): Observable<GrupoResponse> {
    return this.api.get<GrupoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getAll(page = 0, size = 10, sort?: string): Observable<ApiListResponse<GrupoResponse>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (sort) params = params.set('sort', sort);

    return this.api.get<any>(this.base, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content as GrupoResponse[], total: res.totalElements as number })),
      catchError(this.handleError)
    );
  }

  create(payload: GrupoRequest): Observable<GrupoResponse> {
    return this.api.post<GrupoResponse>(this.base, payload).pipe(retry(2), catchError(this.handleError));
  }

  update(id: number, payload: GrupoUpdate): Observable<GrupoResponse> {
    return this.api.put<GrupoResponse>(`${this.base}/${id}`, payload).pipe(retry(2), catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('GrupoService error', error);
    return throwError(() => error);
  }
}
