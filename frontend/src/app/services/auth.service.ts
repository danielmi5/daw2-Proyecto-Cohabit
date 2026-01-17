import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, RegisterRequest, AuthResponse, DecodedToken } from '../models/auth.models';
import { UsuarioResponse } from '../models/usuario.model';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = '/auth';

  private readonly KEY_LOCAL_STORAGE = 'auth_token';

  // Prioriza token persistente (localStorage) y si no existe, usa sessionStorage
  private tokenSignal = signal<string | null>(
    localStorage.getItem(this.KEY_LOCAL_STORAGE) ?? sessionStorage.getItem(this.KEY_LOCAL_STORAGE)
  );

  public usuarioDetalles = signal<UsuarioResponse | null>(null);

  public usuarioActual = computed(() => {
    const token = this.tokenSignal();
    if (!token) return null;

    const decoded = jwtDecode(token) as DecodedToken;
    // Se añade id si ya está cargado desde el backend por email
    return { ...decoded, id: this.usuarioDetalles()?.id ?? null } as DecodedToken & { id?: number | null };
  });

  private tiempoExpiracion: any = null;
  private cargaInicial = false;

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
    // Se borra el temporizador previo
    this.limpiartiempoExpiracion();

    if (recordar) {
      // Persistir entre cierres del navegador
      localStorage.setItem(this.KEY_LOCAL_STORAGE, token);
      // Eliminar cualquier token de sesión anterior
      sessionStorage.removeItem(this.KEY_LOCAL_STORAGE);
    } else {
      // Mantener sólo para la sesión actual (sobrevive recargas, no cierres)
      sessionStorage.setItem(this.KEY_LOCAL_STORAGE, token);
      // Asegurarse de no dejar token persistente
      localStorage.removeItem(this.KEY_LOCAL_STORAGE);
    }

    // Mantener el token en memoria (signal)
    this.tokenSignal.set(token);

    // Se intenta cargar los datos del usuario (incluido su id) a partir del email del token
    this.cargarUsuarioDesdeToken();

    // Si no se recuerda, programa el cierre según el tiempo activo del token
    if (!recordar) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded && decoded.exp) {
          const tiempoToken = decoded.exp * 1000;
          const tiempoActual = Date.now();
          const delay = tiempoToken - tiempoActual;
          if (delay <= 0) {
              // Se determina que el token ya expiró
            this.cerrarSesion();
          } else {
            this.tiempoExpiracion = setTimeout(() => this.cerrarSesion(), delay);
          }
        }
      } catch (e) {
        // Si no se puede decodificar, no se programa temporizador
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
    // Borrar token de ambos storages para asegurar cierre completo
    localStorage.removeItem(this.KEY_LOCAL_STORAGE);
    sessionStorage.removeItem(this.KEY_LOCAL_STORAGE);
    this.tokenSignal.set(null);
    this.usuarioDetalles.set(null);
    this.limpiartiempoExpiracion();
    this.router.navigate(['/login']);
  }

  constructor() {
    // Defer la carga del usuario para evitar dependencia circular
    setTimeout(() => {
      if (!this.cargaInicial && this.tokenSignal()) {
        this.cargaInicial = true;
        this.cargarUsuarioDesdeToken().subscribe();
      }
    }, 0);
  }

  public cargarUsuarioDesdeToken(): Observable<UsuarioResponse | null> {
    const token = this.tokenSignal();
    if (!token) {
      this.usuarioDetalles.set(null);
      return throwError(() => new Error('No token available'));
    }

    // Se obtiene los datos del usuario usando el endpoint /auth/me
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/me`).pipe(
      tap((usuario) => {
        this.usuarioDetalles.set(usuario);
      }),
      catchError((error) => {
        this.usuarioDetalles.set(null);
        return throwError(() => error);
      })
    );
  }

  private limpiartiempoExpiracion(): void {
    if (this.tiempoExpiracion) {
      clearTimeout(this.tiempoExpiracion);
      this.tiempoExpiracion = null;
    }
  }
}
