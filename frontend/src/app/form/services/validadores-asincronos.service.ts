import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

/**
 * Servicio de validadores asíncronos para formularios.
 * Simula validaciones contra backend (ej: verificar si correo ya existe).
 */
@Injectable({
  providedIn: 'root'
})
export class ValidadoresAsincronosService {
  private http = inject(HttpClient);

  /**
   * Validador asíncrono para verificar si un correo ya está registrado.
   * Hace una llamada al backend para comprobar si existe ya ese correo
   */
  correoUnico(): AsyncValidatorFn {
    return (controlCampo: AbstractControl): Observable<ValidationErrors | null> => {
      const valor = controlCampo.value;
      if (!valor) return of(null);

      // Pequeño debounce para no disparar demasiadas peticiones
      return timer(300).pipe(
        switchMap(() => {
          const url = `http://localhost:8080/api/usuarios/existe?email=${encodeURIComponent(valor)}`;
          return this.http.get<{ exists: boolean }>(url).pipe(
            map(resp => (resp.exists ? { emailTaken: true } : null))
          );
        })
      );
    };
  }
}
