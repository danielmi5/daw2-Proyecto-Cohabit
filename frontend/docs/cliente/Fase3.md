# Documentación fase 3 DWEC

## Tabla-resumen de validadores (formularios)


| Validador | Tipo | Qué hace | Dónde se usa |
|---|---|---|---|
| `validarEmailConTLD()` | Síncrono (personalizado) | Comprueba que el correo tiene dominio y extensión (TLD). Devuelve `{ email: true }` cuando no cumple. | Usado en `RegistroForm` (campo `email`) y `LoginForm` (campo `email`) |
| `ValidadoresAsincronosService.correoUnico()` | Asíncrono (servicio) | Comprueba si un correo ya está registrado. Devuelve `{ emailTaken: true }` si el correo existe. | Usado en `RegistroForm` (asyncValidator del campo `email`) |
| `validarFortalezaContrasenia()` | Síncrono (personalizado) | Valida la fortaleza de la contraseña: mínimo 8 caracteres, al menos una letra, un número y un símbolo. Devuelve objeto `passwordStrength` con flags de cada comprobación cuando falla. | Usado en `RegistroForm` (campo `password`) |
| `validarContraseniaCoincidente(controlName, matchControlName)` | Síncrono (personalizado), a nivel de `FormGroup` | Verifica que dos campos coincidan (p. ej. `password` y `passwordConfirm`). Establece `passwordMatch` en el control de confirmación si no coinciden. | Usado en `RegistroForm` como validador del grupo |
| `Validators.required` | Síncrono (Angular) | Marca campo obligatorio. | `RegistroForm`: `nombre`, `apellidos`, `email`, `password`, `passwordConfirm`, `terminos` — `LoginForm`: `email`, `password` |
| `Validators.minLength(n)` | Síncrono (Angular) | Comprueba longitud mínima. | `RegistroForm`: `nombre` y `apellidos` usan `minLength(2)`; `password` usa `minLength(8)` — `LoginForm`: `password` usa `minLength(8)` |
| `Validators.requiredTrue` | Síncrono (Angular) | Valida que un checkbox sea `true`. | `RegistroForm`: términos |


> Nota: Los validadores personalizados se re-exportan desde `frontend/src/app/form/validators/index.ts` para importación centralizada en los formularios.

## Ejemplos de validación asíncrónica

En este proyecto se usa un validador asíncrono para comprobar si un correo ya está registrado. 

Código del servicio (simplificado):

```ts
correoUnico(): AsyncValidatorFn {
	return (control: AbstractControl): Observable<ValidationErrors | null> => {
		if (!control.value) return of(null);
		return timer(1000).pipe(
			switchMap(() => {
				const existe = this.correosRegistrados.includes(control.value.toLowerCase());
				return of(existe ? { emailTaken: true } : null);
			}),
			catchError(() => of(null))
		);
	};
}
```

Uso en `RegistroForm` (campo `email`):

```ts
email: ['', {
	validators: [Validators.required, validarEmailConTLD()],
	asyncValidators: [this.validadoresAsincronos.correoUnico()],
	updateOn: 'change'
}],
```

- En el campo `email` (definición del control):
	- `updateOn: 'change'` hace que tanto los validadores síncronos como los asíncronos se ejecuten al cambiar el valor del control.
	- `asyncValidators: [this.validadoresAsincronos.correoUnico()]` registra el validador asíncrono que se ejecutará tras la validación síncrona.

- En `ValidadoresAsincronosService.correoUnico()`:
	- Se usa `timer(1000)` para simular latencia de red; tras el retardo se comprueba si el correo está registrado y se devuelve `{ emailTaken: true }` cuando existe.
	- El validador devuelve `Observable<ValidationErrors | null>` para integrarse con el sistema reactivo de Angular.

- En la UI del componente de registro:
	- Mientras el validador asíncrono está validando queda en estado `pending`; `getValidationState` evita mostrar errores hasta que termine la validación.
	- Para mostrar mensajes concretos, `getErrorMessage` comprueba `control.errors['emailTaken']` y para estado de validación se puede usar `control.pending` para mostrar "Validando...".
	- Tras completar el registro se llama al backend para subir los datos a la base de datos.


