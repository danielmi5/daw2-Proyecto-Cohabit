import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador a nivel de FormGroup para verificar que dos campos coincidan.
 * Se usa para confirmación de contraseña.
 * 
 * @param controlName Nombre del control principal (ej: 'password')
 * @param matchControlName Nombre del control que debe coincidir (ej: 'passwordConfirm')
 */
export function validarContraseniaCoincidente(controlName: string, matchControlName: string): ValidatorFn {
  return (grupoFormulario: AbstractControl): ValidationErrors | null => {
    const controlPrincipal = grupoFormulario.get(controlName);
    const controlConfirmacion = grupoFormulario.get(matchControlName);

    if (!controlPrincipal || !controlConfirmacion) {
      return null;
    }

    // No valida si los campos están vacíos (deja que required lo maneje)
    if (!controlPrincipal.value || !controlConfirmacion.value) {
      return null;
    }

    if (controlPrincipal.value !== controlConfirmacion.value) {
      // Establece el error en el campo de confirmación
      controlConfirmacion.setErrors({ ...controlConfirmacion.errors, passwordMatch: true });
      return { passwordMatch: true };
    }

    // Limpia el error de passwordMatch si coinciden
    if (controlConfirmacion.errors?.['passwordMatch']) {
      const errores = { ...controlConfirmacion.errors };
      delete errores['passwordMatch'];
      controlConfirmacion.setErrors(Object.keys(errores).length ? errores : null);
    }

    return null;
  };
}
