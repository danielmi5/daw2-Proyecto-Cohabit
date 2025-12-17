import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador de fortaleza de contraseña.
 * Requiere al menos 8 caracteres, una letra, un número y un símbolo.
 */
export function validarFortalezaContrasenia(): ValidatorFn {
  return (controlCampo: AbstractControl): ValidationErrors | null => {
    const valorCampo = controlCampo.value;

    if (!valorCampo) {
      return null; // Si está vacío, deja que Validators.required lo maneje
    }

    const tieneLongitudMin = valorCampo.length >= 8;
    const tieneLetra = /[a-zA-Z]/.test(valorCampo);
    const tieneNumero = /\d/.test(valorCampo);
    const tieneSimbolo = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/.test(valorCampo);

    const contraseniaValida = tieneLongitudMin && tieneLetra && tieneNumero && tieneSimbolo;

    if (!contraseniaValida) {
      return {
        passwordStrength: {
          tieneLongitudMin,
          tieneLetra,
          tieneNumero,
          tieneSimbolo
        }
      };
    }

    return null;
  };
}
