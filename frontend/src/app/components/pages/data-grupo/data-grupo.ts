import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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

  constructor(
    private fb: FormBuilder,
    private grupoService: GrupoService,
    private subidaArchivosService: SubidaArchivosService,
    private notificacionService: NotificacionService
  ) {
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

  /** Método que crea un input file temporal para seleccionar archivo sin mantenerlo en el template */
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

  onEliminarFoto(): void {
    if (!this.puedeEditar()) {
      this.notificacionService.error('Solo el creador o administradores del grupo pueden eliminar la foto');
      return;
    }
    this.eliminarFoto.emit();
  }
}
