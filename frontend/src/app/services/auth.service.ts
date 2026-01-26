import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, RegisterRequest, AuthResponse, DecodedToken } from '../models/auth.models';
import { UsuarioResponse } from '../models/usuario.model';
import { handleHttpError } from './error-handler.util';
import { RUNTIME_CONFIG } from '../../runtime-config';

// Servicio de autenticación (maneja sesiones con signals)
// Soporta persistencia en localStorage o temporal en sessionStorage
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${RUNTIME_CONFIG.apiBaseUrl.replace(/\/+$/,'')}/auth`;
  private readonly KEY_LOCAL_STORAGE = 'auth_token';

  // Prioriza token de localStorage, si no usa sessionStorage
  private tokenSignal = signal<string | null>(
    localStorage.getItem(this.KEY_LOCAL_STORAGE) ?? sessionStorage.getItem(this.KEY_LOCAL_STORAGE)
  );

  public usuarioDetalles = signal<UsuarioResponse | null>(null);

  // Decodifica el token y lo combina con detalles del usuario
  public usuarioActual = computed(() => {
    const token = this.tokenSignal();
    if (!token) return null;

    const decoded = jwtDecode(token) as DecodedToken;
    return { ...decoded, id: this.usuarioDetalles()?.id ?? null } as DecodedToken & { id?: number | null };
  });

  private tiempoExpiracion: any = null; // Timer para auto-logout
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

  /**
   * Registra un nuevo usuario en el sistema
   * @param data - Datos de registro del usuario
   * @param recordar - Si true, persiste la sesión en localStorage; si false, usa sessionStorage
   * @param options - Opciones adicionales para la petición HTTP
   * @returns Observable con el token de autenticación del nuevo usuario
   */
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

  /**
   * Maneja errores HTTP utilizando el handler centralizado
   * @param error - Error HTTP capturado
   * @returns Observable que lanza el error procesado
   * @private
   */
  private handleError(error: any): Observable<never> {
    return handleHttpError(error);
  }

  /**
   * Guarda la sesión del usuario en storage y configura auto-logout si aplica
   * @param token - Token JWT a almacenar
   * @param recordar - Determina si usar localStorage (persistente) o sessionStorage (temporal)
   * @private
   */
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

  /**
   * Obtiene el token JWT actual desde el signal
   * @returns Token JWT o null si no hay sesión activa
   * @public
   */
  obtenerToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Verifica si hay un usuario autenticado actualmente
   * @returns true si existe un token válido, false en caso contrario
   * @public
   */
  autenticado(): boolean {
    return !!this.tokenSignal();
  }

  /**
   * Cierra la sesión actual del usuario.
   * Elimina tokens de ambos storages, limpia signals y redirige al login.
   * @public
   */
  cerrarSesion(): void {
    // Borrar token de ambos storages para asegurar cierre completo
    localStorage.removeItem(this.KEY_LOCAL_STORAGE);
    sessionStorage.removeItem(this.KEY_LOCAL_STORAGE);
    this.tokenSignal.set(null);
    this.usuarioDetalles.set(null);
    this.limpiartiempoExpiracion();
    this.router.navigate(['/login']);
  }

  /**
   * Constructor que inicializa la carga diferida del usuario autenticado.
   * Evita dependencias circulares mediante setTimeout.
   */
  constructor() {
    // Defer la carga del usuario para evitar dependencia circular
    setTimeout(() => {
      if (!this.cargaInicial && this.tokenSignal()) {
        this.cargaInicial = true;
        this.cargarUsuarioDesdeToken().subscribe({ next: () => {}, error: () => {} });
      }
    }, 0);
  }
  /**
   * Carga los detalles completos del usuario desde el backend usando el token actual.
   * Utiliza el endpoint /auth/me para obtener información del usuario autenticado.
   * @returns Observable con los datos del usuario o null si hay error
   * @public
   */
  public cargarUsuarioDesdeToken(): Observable<UsuarioResponse | null> {
    const token = this.tokenSignal();
    if (!token) {
      this.usuarioDetalles.set(null);
      return of(null);
    }

    // Se obtiene los datos del usuario usando el endpoint /auth/me
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/me`).pipe(
      tap((usuario) => {
        this.usuarioDetalles.set(usuario);
      }),
      catchError((error) => {
        this.usuarioDetalles.set(null);
        return of(null);
      })
    );
  }

  /**
   * Limpia el temporizador de expiración de sesión si existe
   * @private
   */
  private limpiartiempoExpiracion(): void {
    if (this.tiempoExpiracion) {
      clearTimeout(this.tiempoExpiracion);
      this.tiempoExpiracion = null;
    }
  }
}
