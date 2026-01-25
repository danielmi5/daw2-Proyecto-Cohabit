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

  tiposRecurso = [
    { valor: 'ESPACIO', etiqueta: 'Espacio' },
    { valor: 'OBJETO', etiqueta: 'Objeto' },
    { valor: 'SERVICIO', etiqueta: 'Servicio' },
    { valor: 'OTRO', etiqueta: 'Otro' }
  ];

  estadosRecurso = [
    { valor: 'DISPONIBLE', etiqueta: 'Disponible' },
    { valor: 'EN_MANTENIMIENTO', etiqueta: 'En mantenimiento' },
    { valor: 'NO_DISPONIBLE', etiqueta: 'No disponible' }
  ];

  private fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recurso'] && this.recurso && this.modoEdicion) {
      this.cargarDatosRecurso();
    } else if (changes['visible'] && this.visible && !this.modoEdicion) {
      this.resetearFormulario();
    }
  }

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

  private resetearFormulario(): void {
    this.formulario.reset({
      tipo: 'ESPACIO',
      estadoActual: 'DISPONIBLE'
    });
    this.archivoSeleccionado = null;
  }

  onArchivoSeleccionado(file: File): void {
    this.archivoSeleccionado = file;
  }

  onCerrar(): void {
    this.cerrar.emit();
  }

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

  onClickFondo(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCerrar();
    }
  }
}
