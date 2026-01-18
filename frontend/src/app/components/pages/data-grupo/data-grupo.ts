import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoResponse } from '../../../models/grupo.model';
import { MiembroGrupoResponse } from '../../../models/miembro-grupo.model';
import { FormInput } from '../../shared/form-input/form-input';
import { FormTextarea } from '../../shared/form-textarea/form-textarea';
import { Button } from '../../shared/button/button';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { GrupoService } from '../../../services/grupo.service';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
  selector: 'app-data-grupo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInput, FormTextarea, Button],
  templateUrl: './data-grupo.html',
  styleUrl: './data-grupo.scss',
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
      // Solo actualizar los campos que tienen valor, para mantener los placeholders
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
      // cleanup
      document.body.removeChild(input);
    });
    document.body.appendChild(input);
    input.click();
  }

  /** Maneja el archivo seleccionado: previsualiza y lo sube usando el servicio */
  handleFile(file: File): void {
    // crear preview local inmediato
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      this.previewUrl = result ?? undefined;
      // si existe grupo con id intentamos guarda la imagen (base64) en fotoGrupo vía PUT
      if (this.grupo?.id) {
        const id = this.grupo.id;
        const payload = { fotoGrupo: this.previewUrl };
        this.grupoService.update(id, payload).subscribe({
          next: (res) => {
            this.grupo = res;
            this.subirFoto.emit(file);
            this.notificacionService.success('Foto actualizada correctamente');
          },
          error: (error) => {
            console.error('[HTTP] Error al subir foto:', error);
            if (error.status === 403) {
              this.notificacionService.error('No tienes permisos para cambiar la foto del grupo');
              // Revertir preview
              this.previewUrl = this.grupo?.fotoGrupo;
            } else {
              // en caso de error, usa preview local y emite igualmente
              if (this.grupo) this.grupo.fotoGrupo = this.previewUrl;
              this.subirFoto.emit(file);
            }
          }
        });
      } else {
        // sin id de grupo, solo previsualizamos y emitimos el archivo
        this.subirFoto.emit(file);
      }
    };
    reader.readAsDataURL(file);
  }

  onEliminarFoto(): void {
    if (!this.puedeEditar()) {
      this.notificacionService.error('Solo el creador o administradores del grupo pueden eliminar la foto');
      return;
    }
    this.eliminarFoto.emit();
  }
}
