import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ApiListResponse, MiembroGrupoResponse, MiembroGrupoRequest, MiembroGrupoUpdate } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MiembroGrupoService {
  private readonly base = '/api/miembros';

  constructor(private api: ApiService) {}

  get(id: number): Observable<MiembroGrupoResponse> {
    return this.api.get<MiembroGrupoResponse>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getAll(page = 0, size = 10): Observable<ApiListResponse<MiembroGrupoResponse>> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.api.get<any>(this.base, { params }).pipe(
      retry(2),
      map(res => ({ items: res.content as MiembroGrupoResponse[], total: res.totalElements as number })),
      catchError(this.handleError)
    );
  }

  create(payload: MiembroGrupoRequest): Observable<MiembroGrupoResponse> {
    return this.api.post<MiembroGrupoResponse>(this.base, payload).pipe(retry(2), catchError(this.handleError));
  }

  update(id: number, payload: MiembroGrupoUpdate): Observable<MiembroGrupoResponse> {
    return this.api.put<MiembroGrupoResponse>(`${this.base}/${id}`, payload).pipe(retry(2), catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('MiembroGrupoService error', error);
    return throwError(() => error);
  }
}
