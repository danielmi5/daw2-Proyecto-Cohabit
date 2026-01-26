import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleHttpError } from './error-handler.util';
import { RUNTIME_CONFIG } from '../../runtime-config';

// Servicio para hacer peticiones HTTP a la API del backend
// Métodos genéricos para CRUD y subida de archivos
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = RUNTIME_CONFIG.apiBaseUrl;

  // Construye la URL completa y normaliza (elimina barras duplicadas)
  private construirUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  get<T>(endpoint: string, options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }): Observable<T> {
    return this.http.get<T>(this.construirUrl(endpoint), options)
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Realiza una petición POST al endpoint especificado con un cuerpo.
   * @param endpoint - Ruta relativa del recurso en la API
   * @param body - Cuerpo de la petición (JSON, FormData, etc.)
   * @param options - Opciones opcionales (params, headers, etc.)
   * @returns Observable con la respuesta tipada
   */
  post<T>(endpoint: string, body: unknown, options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }): Observable<T> {
    return this.http.post<T>(this.construirUrl(endpoint), body, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Realiza una petición PUT al endpoint especificado con un cuerpo.
   * @param endpoint - Ruta relativa del recurso en la API
   * @param body - Cuerpo de la petición (JSON, FormData, etc.)
   * @param options - Opciones opcionales (params, headers, etc.)
   * @returns Observable con la respuesta tipada
   */
  put<T>(endpoint: string, body: unknown, options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }): Observable<T> {
    return this.http.put<T>(this.construirUrl(endpoint), body, options)
      .pipe(catchError(error => this.handleError(error)));
  }

  delete<T>(endpoint: string, options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }): Observable<T> {
    return this.http.delete<T>(this.construirUrl(endpoint), options)
      .pipe(catchError(error => this.handleError(error)));
  }

  // Sube un archivo usando FormData (POST o PUT)
  subirArchivo<T>(
    endpoint: string,
    archivo: File,
    camposAdicionales?: { [clave: string]: string | Blob },
    metodo: 'POST' | 'PUT' = 'POST',
  ): Observable<T> {
    const datosFormulario = new FormData();
    datosFormulario.append('archivo', archivo, archivo.name);

    // Agregar campos adicionales si existen
    if (camposAdicionales) {
      Object.keys(camposAdicionales).forEach(clave => {
        datosFormulario.append(clave, camposAdicionales[clave]);
      });
    }

    // NO establecer Content-Type manualmente para FormData
    // El navegador lo hará automáticamente con el boundary correcto
    // Y el interceptor de auth añadirá el Authorization header
    const peticion = metodo === 'PUT' ? this.http.put<T>(this.construirUrl(endpoint), datosFormulario) : this.http.post<T>(this.construirUrl(endpoint), datosFormulario);

    return peticion.pipe(catchError(error => this.handleError(error)));
  }

  // Sube múltiples archivos usando FormData
  subirMultiplesArchivos<T>(
    endpoint: string,
    archivos: File[],
    camposAdicionales?: { [clave: string]: string | Blob },
    metodo: 'POST' | 'PUT' = 'POST',
    options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }
  ): Observable<T> {
    const datosFormulario = new FormData();

    // Añade cada archivo al FormData
    archivos.forEach((archivo, indice) => {
      datosFormulario.append('archivos', archivo, archivo.name);
    });

    // Añade campos adicionales si existen
    if (camposAdicionales) {
      Object.keys(camposAdicionales).forEach(clave => {
        datosFormulario.append(clave, camposAdicionales[clave]);
      });
    }

    // NO establecer Content-Type manualmente para FormData
    const peticion = metodo === 'PUT'
      ? this.http.put<T>(this.construirUrl(endpoint), datosFormulario)
      : this.http.post<T>(this.construirUrl(endpoint), datosFormulario);

    return peticion.pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }
}