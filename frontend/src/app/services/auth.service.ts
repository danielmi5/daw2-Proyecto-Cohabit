import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, RegisterRequest, AuthResponse, DecodedToken } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // URL del backend (ajusta si tu backend corre en otro host/puerto)
  private apiUrl = 'http://localhost:8080/auth';

  private readonly STORAGE_KEY = 'auth_token';

  private tokenSignal = signal<string | null>(localStorage.getItem(this.STORAGE_KEY));

  public isAuthenticated = computed(() => !!this.tokenSignal());

  public currentUser = computed(() => {
    const token = this.tokenSignal();
    return token ? (jwtDecode(token) as DecodedToken) : null;
  });

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.guardarSesion(response.token)),
      catchError(error => throwError(() => error))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.guardarSesion(response.token)),
      catchError(error => throwError(() => error))
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.tokenSignal.set(null);
    this.router.navigate(['/login']);
  }

  private guardarSesion(token: string): void {
    localStorage.setItem(this.STORAGE_KEY, token);
    this.tokenSignal.set(token);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  // Wrappers para compatibilidad con código existente
  autenticado(): boolean {
    return this.isAuthenticated();
  }

  iniciarSesion(email: string, contrasenia: string): Observable<boolean> {
    return this.login({ email, password: contrasenia }).pipe(map(() => true));
  }

  cerrarSesion(): void {
    this.logout();
  }

  obtenerToken(): string | null {
    return this.getToken();
  }
}
