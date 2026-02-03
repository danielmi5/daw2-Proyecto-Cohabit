import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../button/button';
import { FormInput, EstadoValidacion } from '../form-input/form-input';
import { FormSelect } from '../form-select/form-select';
import { ReservaResponse, RecursoResponse } from '../../../models';

// Modal crear/editar reserva. Validación fecha mínima (no fechas pasadas)
@Component({
  selector: 'app-modal-reserva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, FormInput, FormSelect],
  templateUrl: './modal-reserva.html',
  styleUrls: ['./modal-reserva.scss'],
})
export class ModalReserva implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() modoEdicion = false;
  @Input() reserva: ReservaResponse | null = null;
  @Input() recursos: RecursoResponse[] = [];
  
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  formulario!: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);

  /**
   * Inicializa el formulario.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Carga datos de la reserva o resetea formulario según modo y cambios.
   * 
   * @param changes - Cambios detectados en las propiedades Input
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.formulario) return; // Asegurar que el formulario existe
    
    if (changes['visible'] && this.visible) {
      if (this.modoEdicion && this.reserva) {
        this.cargarDatosReserva();
      } else {
        this.resetearFormulario();
      }
    }
  }

  /**
   * Crea el formulario con sus validadores.
   */
  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      recursoId: [null, Validators.required],
      repeticion: ['no-repetir', Validators.required],
      fecha: ['', [Validators.required, this.validarFechaMinima.bind(this)]],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });
  }

  /**
   * Validador personalizado para evitar fechas pasadas.
   * 
   * @param control - FormControl a validar
   * @returns Objeto con error o null si es válido
   */
  private validarFechaMinima(control: any): { [key: string]: any } | null {
    if (!control.value) return null;
    const fechaSeleccionada = new Date(control.value + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      return { fechaPasada: true };
    }
    return null;
  }

  /**
   * Carga los datos de la reserva en el formulario para edición.
   */
  private cargarDatosReserva(): void {
    if (this.reserva) {
      this.formulario.patchValue({
        recursoId: this.reserva.recursoId,
        repeticion: 'no-repetir',
        fecha: this.reserva.fecha,
        horaInicio: this.reserva.horaInicio,
        horaFin: this.reserva.horaFin,
      });
    }
  }

  /**
   * Resetea el formulario a valores por defecto.
   */
  private resetearFormulario(): void {
    this.formulario.reset({
      repeticion: 'no-repetir'
    });
  }

  /**
   * Emite evento de cierre.
   */
  onCerrar(): void {
    this.cerrar.emit();
  }

  /**
   * Valida y emite los datos del formulario.
   */
  onGuardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardar.emit(this.formulario.value);
  }

  /**
   * Cierra el modal al hacer clic en el fondo (backdrop).
   * 
   * @param event - Evento click del mouse
   */
  onClickFondo(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCerrar();
    }
  }

  /**
   * Obtiene la fecha mínima permitida en formato YYYY-MM-DD.
   * 
   * @returns Fecha de hoy en formato ISO
   */
  getFechaMinima(): string {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  /**
   * Determina el estado de validación del campo `fecha` para `app-form-input`.
   */
  obtenerEstadoValidacionFecha(): EstadoValidacion {
    const control = this.formulario.get('fecha');
    if (!control) return 'inicial';

    if (!control.touched && !control.dirty) return 'inicial';
    if (control.pending) return 'inicial';
    if (control.valid) return 'exito';

    if (control.errors) {
      if (control.errors['required'] && !control.value) return 'advertencia';
      return 'error';
    }

    return 'inicial';
  }

  /**
   * Obtiene el mensaje de error concreto para `fecha`.
   */
  obtenerMensajeErrorFecha(): string {
    const control = this.formulario.get('fecha');
    if (!control || !control.errors) return '';

    if (control.errors['required'] && !control.value) return '';
    if (control.errors['fechaPasada']) return 'La fecha no puede ser pasada';

    return 'Fecha no válida';
  }
}
