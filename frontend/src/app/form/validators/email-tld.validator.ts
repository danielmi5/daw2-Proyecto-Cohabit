import { ValidatorFn, AbstractControl } from '@angular/forms';

/**
 * Validador que exige que el correo tenga un dominio con extensión (TLD), p.ej. ejemplo@dominio.com
 * Devuelve `{ email: true }` cuando NO cumple (compatible con `Validators.email` usado en mensajes).
 */
export function validarEmailConTLD(): ValidatorFn {
  // Patrón: nombre + '@' + dominio + '.' + extensión (mínimo 2 caracteres)
  const patronEmailConTLD = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  return (controlCampo: AbstractControl) => {
    const valorCampo = controlCampo.value;
    // Si está vacío o nulo, no marcar error aquí (se gestiona con `Validators.required` en los formularios)
    if (valorCampo == null || valorCampo === '') return null;

    // Devuelve null cuando es válido, o { email: true } cuando no cumple el patrón
    return patronEmailConTLD.test(valorCampo) ? null : { email: true };
  };
}
