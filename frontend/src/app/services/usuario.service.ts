import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, UsuarioResponse, UsuarioRequest, UsuarioUpdate } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly base = '/api/usuarios';

  constructor(private api: ApiService) {}

  get(id: number): Observable<UsuarioResponse> {
    return this.api.get<UsuarioResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getAll(page = 0, size = 10): Observable<ApiListResponse<UsuarioResponse>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.api.get<any>(this.base, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content as UsuarioResponse[], total: res.totalElements as number })),
      catchError(this.handleError)
    );
  }

  create(payload: UsuarioRequest): Observable<UsuarioResponse> {
    return this.api.post<UsuarioResponse>(this.base, payload).pipe(retry(2), catchError(this.handleError));
  }

  update(id: number, payload: UsuarioUpdate): Observable<UsuarioResponse> {
    return this.api.put<UsuarioResponse>(`${this.base}/${id}`, payload).pipe(retry(2), catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('UsuarioService error', error);
    return throwError(() => error);
  }
}
