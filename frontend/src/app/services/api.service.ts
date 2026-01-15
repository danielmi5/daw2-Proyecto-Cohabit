import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:4200';

  /**
   * Normaliza la URL eliminando barras duplicadas
   */
  private construirUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  /**
   * Realiza una petición GET al endpoint especificado.
   * @param endpoint - Ruta relativa del recurso en la API
   * @param options - Opciones opcionales (params, headers, etc.)
   * @returns Observable con la respuesta tipada
   */
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

  /**
   * Realiza una petición DELETE al endpoint especificado.
   * @param endpoint - Ruta relativa del recurso en la API
   *   (por ejemplo 'usuarios/123')
   * @param options - Opciones opcionales (params, headers, etc.)
   * @returns Observable con la respuesta tipada
   */
  delete<T>(endpoint: string, options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }): Observable<T> {
    return this.http.delete<T>(this.construirUrl(endpoint), options)
      .pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Método para subir archivos al servidor usando FormData
   * @param endpoint - El endpoint de la API
   * @param archivo - El archivo a subir
   * @param camposAdicionales - Campos adicionales opcionales para incluir en el FormData
   * @param metodo - El método HTTP a usar ('POST' o 'PUT'). Por defecto 'POST'
   * @returns Observable con la respuesta del servidor
   */
  subirArchivo<T>(
    endpoint: string,
    archivo: File,
    camposAdicionales?: { [clave: string]: string | Blob },
    metodo: 'POST' | 'PUT' = 'POST',
    options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }
  ): Observable<T> {
    const datosFormulario = new FormData();
    datosFormulario.append('archivo', archivo, archivo.name);

    // Agregar campos adicionales si existen
    if (camposAdicionales) {
      Object.keys(camposAdicionales).forEach(clave => {
        datosFormulario.append(clave, camposAdicionales[clave]);
      });
    }

    const peticion = metodo === 'PUT'
      ? this.http.put<T>(this.construirUrl(endpoint), datosFormulario, options)
      : this.http.post<T>(this.construirUrl(endpoint), datosFormulario, options);

    return peticion.pipe(catchError(error => this.handleError(error)));
  }

  /**
   * Método para subir múltiples archivos al servidor usando FormData
   * @param endpoint - El endpoint de la API
   * @param archivos - Array de archivos a subir
   * @param camposAdicionales - Campos adicionales opcionales para incluir en el FormData
   * @param metodo - El método HTTP a usar ('POST' o 'PUT'). Por defecto 'POST'
   * @returns Observable con la respuesta del servidor
   */
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

    const peticion = metodo === 'PUT'
      ? this.http.put<T>(this.construirUrl(endpoint), datosFormulario, options)
      : this.http.post<T>(this.construirUrl(endpoint), datosFormulario, options);

    return peticion.pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }
}