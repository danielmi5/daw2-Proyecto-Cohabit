import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, RegisterRequest, AuthResponse, DecodedToken } from '../models/auth.models';
import { UsuarioService } from './usuario.service';
import { UsuarioResponse } from '../models/usuario.model';
import { handleHttpError } from './error-handler.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:8080/auth';

  private readonly KEY_LOCAL_STORAGE = 'auth_token';

  private tokenSignal = signal<string | null>(localStorage.getItem(this.KEY_LOCAL_STORAGE));

  private usuarioDetalles = signal<UsuarioResponse | null>(null);

  public usuarioActual = computed(() => {
    const token = this.tokenSignal();
    if (!token) return null;

    const decoded = jwtDecode(token) as DecodedToken;
    // Se añade id si ya está cargado desde el backend por email
    return { ...decoded, id: this.usuarioDetalles()?.id ?? null } as DecodedToken & { id?: number | null };
  });

  private usuarioService = inject(UsuarioService);

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
    // Se borra el temporizador previo
    this.limpiartiempoExpiracion();

    if (recordar) {
      // Se persiste el token en localStorage
      localStorage.setItem(this.KEY_LOCAL_STORAGE, token);
    } else {
      // Se asegura que no quede token persistente si no se pidió recordar
      localStorage.removeItem(this.KEY_LOCAL_STORAGE);
    }

    // Se mantiene el token en memoria (signal) siempre
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
    localStorage.removeItem(this.KEY_LOCAL_STORAGE);
    this.tokenSignal.set(null);
    this.usuarioDetalles.set(null);
    this.limpiartiempoExpiracion();
    this.router.navigate(['/login']);
  }

  constructor() {
    // Al crear el servicio, si ya hay token guardado, se cargan los detalles del usuario
    this.cargarUsuarioDesdeToken();
  }

  private cargarUsuarioDesdeToken(): void {
    const token = this.tokenSignal();
    if (!token) {
      this.usuarioDetalles.set(null);
      return;
    }

    let decoded: any;
    try {
      decoded = jwtDecode(token) as DecodedToken;
    } catch (e) {
      this.usuarioDetalles.set(null);
      return;
    }

    const email = decoded?.sub;
    if (!email) {
      this.usuarioDetalles.set(null);
      return;
    }

    // Se obtiene la lista de usuarios y se busca por email. Se usa un tamaño grande para cubrir casos comunes.
    this.usuarioService.getAll(0, 1000).subscribe({
      next: (res) => {
        const encontrado = res.items.find(u => u.email === email) ?? null;
        this.usuarioDetalles.set(encontrado);
      },
      error: () => this.usuarioDetalles.set(null)
    });
  }

  private limpiartiempoExpiracion(): void {
    if (this.tiempoExpiracion) {
      clearTimeout(this.tiempoExpiracion);
      this.tiempoExpiracion = null;
    }
  }
}
