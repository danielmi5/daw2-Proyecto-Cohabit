import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, RegisterRequest, AuthResponse, DecodedToken } from '../models/auth.models';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:8080/auth';

  private readonly KEY_LOCAL_STORAGE = 'auth_token';

  private tokenSignal = signal<string | null>(localStorage.getItem(this.KEY_LOCAL_STORAGE));

  public usuarioActual = computed(() => {
    const token = this.tokenSignal();
    return token ? (jwtDecode(token) as DecodedToken) : null;
  });

  private tiempoExpiracion: any = null;

  iniciarSesion(
    credenciales: LoginRequest,
    recordar: boolean = false,
    options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales, options).pipe(
      tap(response => this.guardarSesion(response.token, recordar)),
      catchError(error => this.handleError(error))
    );
  }

  registrar(
    data: RegisterRequest,
    recordar: boolean = true,
    options?: { params?: HttpParams; headers?: HttpHeaders; [key: string]: any }
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data, options).pipe(
      tap(response => this.guardarSesion(response.token, recordar)),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }

  private guardarSesion(token: string, recordar: boolean): void {
    // Borra el temporizador previo
    this.limpiartiempoExpiracion();

    if (recordar) {
      // Persiste el token en localStorage
      localStorage.setItem(this.KEY_LOCAL_STORAGE, token);
    }

    // Mantiene el token en memoria (signal) siempre
    this.tokenSignal.set(token);

    // Si no se recuerda, programa el cierre según el tiempo activo del token
    if (!recordar) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded && decoded.exp) {
          const tiempoToken = decoded.exp * 1000;
          const tiempoActual = Date.now();
          const delay = tiempoToken - tiempoActual;
          if (delay <= 0) {
            // El token ya expiró
            this.cerrarSesion();
          } else {
            this.tiempoExpiracion = setTimeout(() => this.cerrarSesion(), delay);
          }
        }
      } catch (e) {
        // Si no puede decodificar, no programa timer
      }
    }
  }

  obtenerToken(): string | null {
    return this.tokenSignal();
  }

  autenticado(): boolean {
    return !!this.tokenSignal();
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.KEY_LOCAL_STORAGE);
    this.tokenSignal.set(null);
    this.limpiartiempoExpiracion();
    this.router.navigate(['/login']);
  }

  private limpiartiempoExpiracion(): void {
    if (this.tiempoExpiracion) {
      clearTimeout(this.tiempoExpiracion);
      this.tiempoExpiracion = null;
    }
  }
}
