import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoResponse } from '../../../models/grupo.model';
import { MiembroGrupoResponse } from '../../../models/miembro-grupo.model';
import { FormInput } from '../../shared/form-input/form-input';
import { FormTextarea } from '../../shared/form-textarea/form-textarea';
import { Button } from '../../shared/button/button';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { GrupoService } from '../../../services/grupo.service';
import { SubidaArchivosService } from '../../../services/subida-archivos.service';
import { NotificacionService } from '../../../services/notificacion.service';

// Formulario para editar datos del grupo (nombre, dirección, descripción, foto)
// Solo CREADOR/ADMIN pueden editar. Incluye preview de foto y subida automática
@Component({
  selector: 'app-data-grupo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInput, FormTextarea, Button],
  templateUrl: './data-grupo.html',
  styleUrls: ['./data-grupo.scss'],
})
export class DataGrupo implements OnChanges {
  @Input() grupo: GrupoResponse | null = null;
  @Input() miembro: MiembroGrupoResponse | null = null;

  @Output() actualizar = new EventEmitter<GrupoResponse>();
  @Output() subirFoto = new EventEmitter<File>();
  @Output() eliminarFoto = new EventEmitter<void>();

  formulario: FormGroup;
  previewUrl: string | undefined = undefined;

  private fb = inject(FormBuilder);
  private grupoService = inject(GrupoService);
  private subidaArchivosService = inject(SubidaArchivosService);
  private notificacionService = inject(NotificacionService);

  constructor() {
    this.formulario = this.fb.group({
      nombre: [''],
      direccion: [''],
      descripcion: ['']
    });
  }

  puedeEditar(): boolean {
    return this.miembro?.rol === 'CREADOR' || this.miembro?.rol === 'ADMIN';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupo'] && this.grupo) {
      // Solo actualiza los campos que tienen valor, para mantener los placeholders
      const valores: any = {};
      if (this.grupo.nombre) valores.nombre = this.grupo.nombre;
      if (this.grupo.direccion) valores.direccion = this.grupo.direccion;
      if (this.grupo.descripcion) valores.descripcion = this.grupo.descripcion;
      
      this.formulario.patchValue(valores);
    }
  }

  onGuardar(): void {
    if (this.formulario.invalid) return;
    
    if (!this.puedeEditar()) {
      this.notificacionService.error('Solo el creador o administradores del grupo pueden editar estos datos');
      return;
    }
    
    const valores = this.formulario.value;
    const actualizado: GrupoResponse = {
      ...this.grupo,
      nombre: valores.nombre,
      direccion: valores.direccion,
      descripcion: valores.descripcion
    };
    // Persiste cambios en backend si existe id
    if (this.grupo?.id) {
      const id = this.grupo.id;
      this.grupoService.update(id, { nombre: actualizado.nombre, direccion: actualizado.direccion, descripcion: actualizado.descripcion }).subscribe({
        next: (res) => {
          this.grupo = res;
          this.actualizar.emit(res);
        },
        error: (error) => {
          console.error('[HTTP] Error al actualizar grupo:', error);
          if (error.status === 403) {
            this.notificacionService.error('No tienes permisos para actualizar este grupo. Solo el creador o administradores pueden hacerlo.');
          } else {
            this.notificacionService.error('Error al actualizar el grupo');
          }
        }
      });
    } else {
      this.actualizar.emit(actualizado);
    }
  }

  // Crea input file temporal para seleccionar archivo sin mantenerlo en template
  openFileSelector(): void {
    if (!this.puedeEditar()) {
      this.notificacionService.error('Solo el creador o administradores del grupo pueden cambiar la foto');
      return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.addEventListener('change', (ev: Event) => {
      const target = ev.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      const file = target.files[0];
      this.handleFile(file);
      // Elimina el input temporal
      document.body.removeChild(input);
    });
    document.body.appendChild(input);
    input.click();
  }

  /** Maneja el archivo seleccionado: previsualiza y lo sube usando el servicio */
  /**
   * Maneja el archivo de imagen seleccionado.
   * 
   * @param file - Archivo de imagen seleccionado por el usuario.
   * 
   * @remarks
   * Proceso de manejo:
   * 1. Genera una previsualización local inmediata usando FileReader.
   * 2. Actualiza `previewUrl` con la URL generada en base64.
   * 
   * Si el grupo tiene ID (grupo existente):
   * - Sube la foto al backend usando `SubidaArchivosService.subirFotoGrupo()`.
   * - Actualiza el objeto `grupo` con la respuesta del servidor.
   * - Emite el evento `subirFoto` para notificar al componente padre.
   * - Muestra notificación de éxito.
   * - Maneja errores específicos:
   *   - 413: Archivo supera 5 MB
   *   - 403: Sin permisos
   *   - Otros: Error genérico
   * - En caso de error, revierte la preview a la foto original del grupo.
   * 
   * Si el grupo no tiene ID (modo creación):
   * - Solo previsualiza y emite el evento `subirFoto` sin persistir en el backend.
   */
  handleFile(file: File): void {
    // Crea preview local inmediato
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      this.previewUrl = result ?? undefined;
    };
    reader.readAsDataURL(file);

    // Si existe grupo con id, sube usando el servicio especializado
    if (this.grupo?.id) {
      this.subidaArchivosService.subirFotoGrupo(this.grupo.id, file).subscribe({
        next: (res) => {
          this.grupo = res;
          this.subirFoto.emit(file);
          this.notificacionService.success('Foto actualizada correctamente');
        },
        error: (error) => {
          console.error('[HTTP] Error al subir foto:', error);
          if (error?.status === 413) {
            this.notificacionService.error('El archivo supera el tamaño máximo permitido (5 MB)');
          } else if (error?.status === 403) {
            this.notificacionService.error('No tienes permisos para cambiar la foto del grupo');
          } else {
            this.notificacionService.error('Error al subir la foto del grupo');
          }
          // Revierte preview
          this.previewUrl = this.grupo?.fotoGrupo;
        }
      });
    } else {
      // sin id de grupo, solo se previsualiza y se emite el archivo
      this.subirFoto.emit(file);
    }
  }

  /**
   * Elimina la foto del grupo.
   * 
   * @remarks
   * Validación:
   * - Verifica que el usuario tenga permisos usando `puedeEditar()`.
   * 
   * Emite el evento `eliminarFoto` para que el componente padre maneje
   * la eliminación de la foto en el backend.
   */
  onEliminarFoto(): void {
    if (!this.puedeEditar()) {
      this.notificacionService.error('Solo el creador o administradores del grupo pueden eliminar la foto');
      return;
    }
    this.eliminarFoto.emit();
  }
}
