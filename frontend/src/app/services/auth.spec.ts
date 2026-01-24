import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockAuthResponse: AuthResponse = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjo5OTk5OTk5OTk5fQ.4Adcj0pGj7gJMGdQJLx9P3pVUjJwRgZCQbGBGWOYSQo'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Limpiar storage antes de cada test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', (done) => {
    const credentials: LoginRequest = {
      email: 'test@test.com',
      password: 'password123'
    };

    service.iniciarSesion(credentials, false).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
      expect(service.usuarioActual()).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(request => 
      request.url.includes('/auth/login')
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockAuthResponse);
  });

  it('should register successfully', (done) => {
    const registerData: RegisterRequest = {
      nombre: 'Test',
      apellidos: 'User',
      email: 'test@test.com',
      password: 'password123'
    };

    service.registrar(registerData).subscribe((response: AuthResponse) => {
      expect(response).toEqual(mockAuthResponse);
      done();
    });

    const req = httpMock.expectOne(request => 
      request.url.includes('/auth/registro')
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerData);
    req.flush(mockAuthResponse);
  });

  it('should store token in localStorage when recordar is true', (done) => {
    const credentials: LoginRequest = {
      email: 'test@test.com',
      password: 'password123'
    };

    service.iniciarSesion(credentials, true).subscribe(() => {
      expect(localStorage.getItem('auth_token')).toBe(mockAuthResponse.token);
      done();
    });

    const req = httpMock.expectOne(request => 
      request.url.includes('/auth/login')
    );
    req.flush(mockAuthResponse);
  });

  it('should store token in sessionStorage when recordar is false', (done) => {
    const credentials: LoginRequest = {
      email: 'test@test.com',
      password: 'password123'
    };

    service.iniciarSesion(credentials, false).subscribe(() => {
      expect(sessionStorage.getItem('auth_token')).toBe(mockAuthResponse.token);
      expect(localStorage.getItem('auth_token')).toBeNull();
      done();
    });

    const req = httpMock.expectOne(request => 
      request.url.includes('/auth/login')
    );
    req.flush(mockAuthResponse);
  });

  it('should check if user is authenticated', () => {
    expect(service.autenticado()).toBe(false);
    
    localStorage.setItem('auth_token', mockAuthResponse.token);
    service = TestBed.inject(AuthService); // Recrear servicio para leer el token
    
    expect(service.autenticado()).toBe(true);
  });

  it('should logout and clear token', () => {
    localStorage.setItem('auth_token', mockAuthResponse.token);
    
    service.cerrarSesion();
    
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(service.usuarioActual()).toBeNull();
  });

  it('should handle login error', (done) => {
    const credentials: LoginRequest = {
      email: 'test@test.com',
      password: 'wrongpassword'
    };

    service.iniciarSesion(credentials).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      }
    });

    const req = httpMock.expectOne(request => 
      request.url.includes('/auth/login')
    );
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});
