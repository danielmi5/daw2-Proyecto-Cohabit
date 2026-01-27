import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormInput, EstadoValidacion } from '../form-input/form-input';
import { FormCheckbox } from '../form-checkbox/form-checkbox';
import { Button } from '../button/button';
import { RouterLink } from '@angular/router';
import { validarFortalezaContrasenia, validarContraseniaCoincidente, validarEmailConTLD } from '../../../form/validators';
import { ValidadoresAsincronosService } from '../../../form/services/validadores-asincronos.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { RedireccionService } from '../../../services/redireccion.service';

// Formulario registro con validación sincrónica + asincrónica (email único). FormBuilder + Reactive Forms
@Component({
  selector: 'app-registro-form',
  imports: [FormInput, FormCheckbox, Button, RouterLink, ReactiveFormsModule],
  templateUrl: './registro-form.html',
  styleUrls: ['./registro-form.scss'],
})
export class RegistroForm implements OnInit {
  private constructorFormulario = inject(FormBuilder);
  private validadoresAsincronos = inject(ValidadoresAsincronosService);
  private notificationService = inject(NotificacionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private redireccionService = inject(RedireccionService);
  
  formularioRegistro!: FormGroup;

  // Mensajes de validación por campo (warning, error, success)
  private mensajes = {
    warning: {
      nombre: 'El nombre es obligatorio',
      apellidos: 'Los apellidos son obligatorios',
      email: 'El correo electrónico es obligatorio',
      password: 'La contraseña es obligatoria',
      passwordConfirm: 'La confirmación de contraseña es obligatoria',
      terminos: 'Debe aceptar los términos'
    },
    error: {
      email: 'El correo electrónico no tiene un formato válido',
      emailTaken: 'Este correo electrónico ya está registrado'
    },
    success: {
      nombre: 'El nombre es correcto',
      apellidos: 'Los apellidos son correctos',
      email: 'El correo electrónico es correcto',
      password: 'La contraseña es correcta',
      passwordConfirm: 'La confirmación de contraseña es correcta',
      terminos: 'Los términos han sido aceptados'
    }
  } as const;

  /**
   * Inicializa el formulario reactivo con validadores sincrónicos y asincrónicos.
   * 
   * @remarks
   * Validaciones:
   * - nombre/apellidos: requerido + mínimo 2 caracteres
   * - email: requerido + formato TLD + unicidad (asincrónico)
   * - password: requerido + mínimo 8 + fortaleza (letra, número, símbolo)
   * - passwordConfirm: requerido
   * - terminos: requiredTrue
   * - Validador de formulario: contraseñas coincidentes
   */
  ngOnInit(): void {
    this.formularioRegistro = this.constructorFormulario.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', {
        validators: [Validators.required, validarEmailConTLD()],
        asyncValidators: [this.validadoresAsincronos.correoUnico()],
        updateOn: 'change'
      }],
      password: ['', [Validators.required, Validators.minLength(8), validarFortalezaContrasenia()]],
      passwordConfirm: ['', [Validators.required]],
      terminos: [false, [Validators.requiredTrue]]
    }, {
      validators: [validarContraseniaCoincidente('password', 'passwordConfirm')]
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
   * 1. INICIAL: sin interacción o validación pendiente (pending)
   * 2. ADVERTENCIA: campo obligatorio vacío tras interacción
   * 3. ERROR: valor incorrecto
   * 4. ÉXITO: valor válido
   */
  obtenerEstadoValidacion(controlName: string): EstadoValidacion {
    const control = this.formularioRegistro.get(controlName);
    if (!control) return 'inicial';

    // Estado INICIAL: usuario no ha interactuado
    if (!control.touched && !control.dirty) {
      return 'inicial';
    }

    // Si está pendiente de validación asíncrona, mantener inicial
    if (control.pending) {
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
   * 
   * @remarks
   * Maneja errores de: email, emailTaken, minlength, passwordStrength, passwordMatch.
   */
  obtenerMensajeError(controlName: string): string {
    const control = this.formularioRegistro.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required'] && !control.value) return '';

    if (control.errors['email']) {
      return (this.mensajes.error as any)['email'] || 'El email no tiene un formato válido';
    }

    if (control.errors['emailTaken']) {
      return (this.mensajes.error as any)['emailTaken'] || 'Este correo electrónico ya está registrado';
    }

    if (control.errors['minlength']) {
      const required = control.errors['minlength'].requiredLength;
      const fieldLabels: Record<string, string> = {
        nombre: 'El nombre',
        apellidos: 'Los apellidos',
        password: 'La contraseña'
      };
      const verb = controlName === 'apellidos' ? 'deben' : 'debe';
      return `${fieldLabels[controlName] || 'Este campo'} ${verb} tener al menos ${required} caracteres`;
    }

    if (control.errors['passwordStrength']) {
      const { tieneLongitudMin, tieneLetra, tieneNumero, tieneSimbolo } = control.errors['passwordStrength'];
      if (!tieneLongitudMin) return 'La contraseña debe tener al menos 8 caracteres';
      if (!tieneLetra) return 'La contraseña debe contener al menos una letra';
      if (!tieneNumero) return 'La contraseña debe contener al menos un número';
      if (!tieneSimbolo) return 'La contraseña debe contener al menos un símbolo';
    }

    if (control.errors['passwordMatch']) {
      return 'Las contraseñas no coinciden';
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
   * Verifica si un campo debe mostrar error visual.
   * 
   * @param controlName - Nombre del FormControl
   * @returns true si el campo tiene error y fue interactuado
   * 
   * @remarks
   * Usado principalmente para checkbox de términos.
   */
  debeMostrarError(controlName: string): boolean {
    const control = this.formularioRegistro.get(controlName);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  /**
   * Verifica si el campo email está pendiente de validación asíncrona
   */
  emailPendiente(): boolean {
    return this.formularioRegistro.get('email')?.pending ?? false;
  }

  /**
   * Verifica si el formulario está pendiente de validación
   */
  formularioPendiente(): boolean {
    return this.formularioRegistro.pending;
  }

  /**
   * Obtiene el texto del botón de submit según el estado
   */
  obtenerTextoBotonSubmit(): string {
    if (this.formularioPendiente()) return 'Validando...';
    return 'Registrarse';
  }

  /**
   * Maneja el envío del formulario.
   * 
   * @remarks
   * Valida el formulario, llama al servicio de autenticación y redirige al perfil o URL guardada.
   */
  onSubmit(): void {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      this.notificationService.error("Hay errores en el formulario");
      return;
    }

    const { nombre, apellidos, email, password, terminos } = this.formularioRegistro.value;
    const request = { nombre, apellidos, email, password };

    this.authService.registrar(request).subscribe({
      next: () => {
        this.notificationService.success("Registro completado correctamente");
        const url = this.redireccionService.obtenerUrlAVolver();
        this.router.navigateByUrl(url ? url : '/perfil')
        this.redireccionService.limpiarUrlAVolver();
      },
      error: (err) => {
        if (err?.status === 409) {
          this.notificationService.error("Este email ya está registrado");
        } else {
          this.notificationService.error("Error al registrar usuario");
        }
      }
    });

  }

  /**
   * Maneja el registro con Google OAuth.
   * 
   * @remarks
   * TODO: Implementar integración con Google OAuth 2.0
   */
  iniciarRegistroGoogle(): void {
    console.log('Google register clicked');
    // TODO: Implementar OAuth con Google
    this.notificationService.info("Iniciando registro con Google...");
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
    if (!this.formularioRegistro) return false;
    return this.formularioRegistro.dirty || this.formularioRegistro.touched;
  }
}
