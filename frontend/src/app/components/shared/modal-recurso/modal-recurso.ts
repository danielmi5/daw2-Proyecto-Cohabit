import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../button/button';
import { FormInput } from '../form-input/form-input';
import { FormSelect } from '../form-select/form-select';
import { FormTextarea } from '../form-textarea/form-textarea';
import { FormArchivo } from '../form-archivo/form-archivo';
import { RecursoResponse } from '../../../models';
import { SubidaArchivosService } from '../../../services/subida-archivos.service';
import { NotificacionService } from '../../../services/notificacion.service';

// Modal crear/editar recurso. Modos: creación (vacío) y edición (precargado). Con upload de imagen
@Component({
  selector: 'app-modal-recurso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, FormInput, FormSelect, FormTextarea, FormArchivo],
  templateUrl: './modal-recurso.html',
  styleUrls: ['./modal-recurso.scss'],
})
export class ModalRecurso implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() modoEdicion = false;
  @Input() recurso: RecursoResponse | null = null;
  
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  private subidaArchivosService: SubidaArchivosService = inject(SubidaArchivosService);
  private notificacionService: NotificacionService = inject(NotificacionService);

  formulario!: FormGroup;
  archivoSeleccionado: File | null = null;

  /** Opciones de tipo de recurso para el select */
  tiposRecurso = [
    { valor: 'ESPACIO', etiqueta: 'Espacio' },
    { valor: 'OBJETO', etiqueta: 'Objeto' },
    { valor: 'SERVICIO', etiqueta: 'Servicio' },
    { valor: 'OTRO', etiqueta: 'Otro' }
  ];

  /** Opciones de estado del recurso para el select */
  estadosRecurso = [
    { valor: 'DISPONIBLE', etiqueta: 'Disponible' },
    { valor: 'OCUPADO', etiqueta: 'Ocupado' },
    { valor: 'EN_MANTENIMIENTO', etiqueta: 'En mantenimiento' },
    { valor: 'FUERA_DE_SERVICIO', etiqueta: 'Fuera de servicio' }
  ];

  private fb: FormBuilder = inject(FormBuilder);

  /**
   * Inicializa el formulario.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /**
   * Carga datos del recurso o resetea formulario según modo y cambios.
   * 
   * @param changes - Cambios detectados en las propiedades Input
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recurso'] && this.recurso && this.modoEdicion) {
      this.cargarDatosRecurso();
    } else if (changes['visible'] && this.visible && !this.modoEdicion) {
      this.resetearFormulario();
    }
  }

  /**
   * Crea el formulario con sus validadores.
   */
  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.maxLength(500)],
      tipo: ['ESPACIO', Validators.required],
      estadoActual: ['DISPONIBLE', Validators.required],
      capacidad: [null, [Validators.min(0)]],
      ubicacion: ['', Validators.maxLength(200)]
    });
  }

  /**
   * Carga los datos del recurso en el formulario para edición.
   */
  private cargarDatosRecurso(): void {
    if (this.recurso) {
      this.formulario.patchValue({
        nombre: this.recurso.nombre || '',
        descripcion: this.recurso.descripcion || '',
        tipo: this.recurso.tipo || 'ESPACIO',
        estadoActual: this.recurso.estadoActual || 'DISPONIBLE',
        capacidad: this.recurso.capacidad || null,
        ubicacion: this.recurso.ubicacion || ''
      });
      this.archivoSeleccionado = null;
    }
  }

  /**
   * Resetea el formulario a valores por defecto.
   */
  private resetearFormulario(): void {
    this.formulario.reset({
      tipo: 'ESPACIO',
      estadoActual: 'DISPONIBLE'
    });
    this.archivoSeleccionado = null;
  }

  /**
   * Maneja la selección de un archivo de imagen.
   * 
   * @param file - Archivo seleccionado
   */
  onArchivoSeleccionado(file: File): void {
    this.archivoSeleccionado = file;
  }

  /**
   * Emite evento de cierre.
   */
  onCerrar(): void {
    this.cerrar.emit();
  }

  /**
   * Valida y emite los datos del formulario.
   * 
   * @remarks
   * Elimina campos vacíos opcionales y adjunta el archivo si existe.
   */
  onGuardar(): void {
    if (this.formulario.valid) {
      const datos = this.formulario.value;
      if (!datos.descripcion) delete datos.descripcion;
      if (!datos.capacidad) delete datos.capacidad;
      if (!datos.ubicacion) delete datos.ubicacion;
      
      if (this.archivoSeleccionado) {
        datos.archivo = this.archivoSeleccionado;
      }
      
      this.guardar.emit(datos);
    }
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
}
