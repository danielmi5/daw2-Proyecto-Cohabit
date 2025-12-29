import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { validarEmailConTLD } from '../../../form/validators/email-tld.validator';
import { FormInput, EstadoValidacion } from '../form-input/form-input';
import { FormCheckbox } from '../form-checkbox/form-checkbox';
import { Button } from '../button/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [FormInput, FormCheckbox, Button, RouterLink, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm implements OnInit {
  private constructorFormulario = inject(FormBuilder);
  
  formularioLogin!: FormGroup;

  // Mensajes por campo (warnings, errors, success)
  private mensajes = {
    warning: {
      email: 'El correo electrónico es obligatorio',
      password: 'La contraseña es obligatoria'
    },
    error: {
      email: 'El correo electrónico no tiene un formato válido',
      password: 'La contraseña debe tener al menos 8 caracteres'
    },
    success: {
      email: 'El correo electrónico es correcto',
      password: 'La contraseña es correcta'
    }
  } as const;

  ngOnInit(): void {
    this.formularioLogin = this.constructorFormulario.group({
      email: ['', {
        validators: [Validators.required, validarEmailConTLD()],
        updateOn: 'change'
      }],
      password: ['', [Validators.required, Validators.minLength(8)]],
      remember: [false]
    });
  }

  /**
   * Determina el estado de validación de un campo.
   * Estado 1: INICIAL - sin interacción (!touched && !dirty)
   * Estado 2: ADVERTENCIA - campo obligatorio vacío tras interacción  
   * Estado 3: ERROR - valor incorrecto
   * Estado 4: ÉXITO - valor válido
   */
  getValidationState(controlName: string): EstadoValidacion {
    const control = this.formularioLogin.get(controlName);
    if (!control) return 'inicial';

    // Estado INICIAL: usuario no ha interactuado
    if (!control.touched && !control.dirty) {
      return 'inicial';
    }

    // Campo válido = ÉXITO
    if (control.valid) {
      return 'exito';
    }

    // Campo inválido: determinar si es advertencia o error
    if (control.errors) {
      // Si solo tiene error de required y está vacío = ADVERTENCIA
      if (control.errors['required'] && !control.value) {
        return 'advertencia';
      }
      // Tiene valor pero es incorrecto = ERROR
      return 'error';
    }

    return 'inicial';
  }

  /**
   * Obtiene el mensaje de advertencia (campo obligatorio vacío)
   */
  getWarningMessage(controlName: string): string {
    return (this.mensajes.warning as any)[controlName] || `${controlName} es obligatorio`;
  }

  /**
   * Obtiene el mensaje de error (valor incorrecto)
   */
  getErrorMessage(controlName: string): string {
    const control = this.formularioLogin.get(controlName);
    if (!control || !control.errors) return '';

    // Se maneja como advertencia
    if (control.errors['required'] && !control.value) return '';

    // Mensajes estáticos por campo
    const staticMsg = (this.mensajes.error as any)[controlName];
    if (staticMsg) return staticMsg;

    // Mensajes dinámicos
    if (control.errors['minlength']) {
      const required = control.errors['minlength'].requiredLength;
      return `La contraseña debe tener al menos ${required} caracteres`;
    }

    return 'Campo inválido';
  }

  /**
   * Obtiene el mensaje de éxito
   */
  getSuccessMessage(controlName: string): string {
    return (this.mensajes.success as any)[controlName] || `${controlName} es correcto`;
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const { email, password, remember } = this.formularioLogin.value;
    console.log('Login submit:', { email, password, remember });
    // TODO: Implementar lógica de autenticación
  }

  hayCambiosAuth(): boolean {
    if (!this.formularioLogin) return false;
    return this.formularioLogin.dirty || this.formularioLogin.touched;
  }

  /**
   * Maneja el inicio de sesión con Google
   */
  onGoogleLogin(): void {
    // TODO: Implementar OAuth con Google
  }
}
