import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:4200';

  get<T>(endpoint: string, options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  post<T>(endpoint: string, body: unknown, options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  put<T>(endpoint: string, body: unknown, options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  delete<T>(endpoint: string, options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }
}