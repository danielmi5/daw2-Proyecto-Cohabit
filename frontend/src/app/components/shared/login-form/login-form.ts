import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { validarEmailConTLD } from '../../../form/validators/email-tld.validator';
import { FormInput, EstadoValidacion } from '../form-input/form-input';
import { FormCheckbox } from '../form-checkbox/form-checkbox';
import { Button } from '../button/button';
import { RouterLink } from '@angular/router';
import { NotificacionService } from '../../../services/notificacion.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { RedireccionService } from '../../../services/redireccion.service';

// Formulario login con validación tiempo real. FormBuilder + Reactive Forms
@Component({
  selector: 'app-login-form',
  imports: [FormInput, FormCheckbox, Button, RouterLink, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.scss'],
})
export class LoginForm implements OnInit {
  private constructorFormulario = inject(FormBuilder);
  private notificationService = inject(NotificacionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private redireccionService = inject(RedireccionService);
  
  formularioLogin!: FormGroup;

  // Mensajes de validación por campo (warning, error, success)
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

  /**
   * Inicializa el formulario reactivo con validadores.
   * 
   * @remarks
   * - email: requerido + formato con TLD
   * - password: requerido + mínimo 8 caracteres
   * - recordar: checkbox sin validación
   */
  ngOnInit(): void {
    this.formularioLogin = this.constructorFormulario.group({
      email: ['', {
        validators: [Validators.required, validarEmailConTLD()],
        updateOn: 'change'
      }],
      password: ['', [Validators.required, Validators.minLength(8)]],
      recordar: [false]
    });
  }

  /**
   * Determina el estado de validación de un campo.
   * 
   * @param controlName - Nombre del FormControl
   * @returns Estado de validación (inicial, advertencia, error, exito)
   * 
   * @remarks
   * Lógica de estados:
   * 1. INICIAL: sin interacción (!touched && !dirty)
   * 2. ADVERTENCIA: campo obligatorio vacío tras interacción
   * 3. ERROR: valor incorrecto (formato inválido, longitud insuficiente)
   * 4. ÉXITO: valor válido
   */
  obtenerEstadoValidacion(controlName: string): EstadoValidacion {
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
   * Obtiene el mensaje de advertencia (campo obligatorio vacío).
   * 
   * @param controlName - Nombre del FormControl
   * @returns Mensaje de advertencia
   */
  obtenerMensajeAdvertencia(controlName: string): string {
    return (this.mensajes.warning as any)[controlName] || `${controlName} es obligatorio`;
  }

  /**
   * Obtiene el mensaje de error (valor incorrecto).
   * 
   * @param controlName - Nombre del FormControl
   * @returns Mensaje de error específico o genérico
   */
  obtenerMensajeError(controlName: string): string {
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
   * Obtiene el mensaje de éxito.
   * 
   * @param controlName - Nombre del FormControl
   * @returns Mensaje de éxito
   */
  obtenerMensajeExito(controlName: string): string {
    return (this.mensajes.success as any)[controlName] || `${controlName} es correcto`;
  }

  /**
   * Maneja el envío del formulario.
   * 
   * @remarks
   * Valida el formulario, llama al servicio de autenticación y redirige al dashboard o URL guardada.
   */
  onSubmit(): void {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      this.notificationService.error("Hay errores en el formulario");
      return;
    }

    const { email, password, recordar } = this.formularioLogin.value;
    this.authService.iniciarSesion({ email, password }, !!recordar).subscribe({
      next: () => {
        this.notificationService.success("Inicio de sesión completado correctamente");
        const url = this.redireccionService.obtenerUrlAVolver();
        this.router.navigateByUrl(url ? url : '/dashboard')
        this.redireccionService.limpiarUrlAVolver();
      },
      error: (err) => {
        if (err?.status === 401) {
          this.notificationService.error("Credenciales incorrectas. Intenta de nuevo.");
        } else {
          this.notificationService.error("Error de conexión con el servidor.");
        }
      }
    });
  }

  /**
   * Indica si hay cambios en el formulario.
   * 
   * @returns true si el formulario fue modificado o tocado
   * 
   * @remarks
   * Usado por el guard salir-auth-guard para prevenir pérdida de datos.
   */
  hayCambiosAuth(): boolean {
    if (!this.formularioLogin) return false;
    return this.formularioLogin.dirty || this.formularioLogin.touched;
  }

  /**
   * Maneja el inicio de sesión con Google OAuth.
   * 
   * @remarks
   * TODO: Implementar integración con Google OAuth 2.0
   */
  iniciarSesionGoogle(): void {
    // TODO: Implementar OAuth con Google
    //this.notificationService.info("Iniciando sesión con Google...");

    this.notificationService.info("Iniciando sesión con Google...");
  }
}
