import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

/**
 * Servicio de validadores asíncronos para formularios.
 * Simula validaciones contra backend (ej: verificar si correo ya existe).
 */
@Injectable({
  providedIn: 'root'
})
export class ValidadoresAsincronosService {
  // Correos simulados que ya están registrados (para testing)
  private correosRegistrados = [
    'daniel@test.com',
    'daniel@cohabit.com',
    'daniel@ejemplo.com'
  ];

  /**
   * Validador asíncrono para verificar si un correo ya está registrado.
   * Simula una llamada al backend ya que actualmente no hay conexión
   */
  correoUnico(): AsyncValidatorFn {
    return (controlCampo: AbstractControl): Observable<ValidationErrors | null> => {
      if (!controlCampo.value) {
        return of(null);
      }

      // Simula delay de red (1 segundo)
      return timer(1000).pipe(
        switchMap(() => {
          const correoExiste = this.correosRegistrados.includes(controlCampo.value.toLowerCase());
          return of(correoExiste ? { emailTaken: true } : null);
        }),
        catchError(() => of(null))
      );
    };
  }

  /**
   * Método para añadir un correo a la lista de registrados (útil tras registro exitoso).
   */
  agregarCorreoRegistrado(correo: string): void {
    if (!this.correosRegistrados.includes(correo.toLowerCase())) {
      this.correosRegistrados.push(correo.toLowerCase());
    }
  }
}
