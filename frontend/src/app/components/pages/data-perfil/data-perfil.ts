import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '../../../models/usuario.model';
import { FormInput } from '../../shared/form-input/form-input';
import { Button } from '../../shared/button/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { SubidaArchivosService } from '../../../services/subida-archivos.service';
import { NotificacionService } from '../../../services/notificacion.service';

// Formulario para editar datos del perfil (nombre, apellidos, país, ciudad, teléfono, foto)
@Component({
  selector: 'app-data-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInput, Button],
  templateUrl: './data-perfil.html',
  styleUrls: ['./data-perfil.scss'],
})
export class DataPerfil implements OnChanges {
  @Input() usuario: UsuarioResponse | null = null;

  @Output() actualizar = new EventEmitter<UsuarioResponse>();
  @Output() subirFoto = new EventEmitter<File>();
  @Output() eliminarFoto = new EventEmitter<void>();

  formulario: FormGroup;
  previewUrl: string | undefined = undefined;

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private subidaArchivosService = inject(SubidaArchivosService);
  private notificacionService = inject(NotificacionService);

  constructor() {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      pais: [''],
      ciudad: [''],
      telefono: ['', [Validators.pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && this.usuario) {
      // Solo actualiza los campos que tienen valor, para mantener los placeholders
      const valores: any = {};
      if (this.usuario.nombre) valores.nombre = this.usuario.nombre;
      if (this.usuario.apellidos) valores.apellidos = this.usuario.apellidos;
      if (this.usuario.pais) valores.pais = this.usuario.pais;
      if (this.usuario.ciudad) valores.ciudad = this.usuario.ciudad;
      if (this.usuario.telefono) valores.telefono = this.usuario.telefono;
      
      this.formulario.patchValue(valores);
    }
  }

  onGuardar(): void {
    if (this.formulario.invalid) {
      this.notificacionService.error('Por favor, corrige los errores en el formulario');
      return;
    }
    
    const valores = this.formulario.value;
    const payload: any = {
      nombre: valores.nombre,
      apellidos: valores.apellidos,
      pais: valores.pais || undefined,
      ciudad: valores.ciudad || undefined,
      telefono: valores.telefono || undefined
    };
    
    // Persiste cambios en backend si existe id
    if (this.usuario?.id) {
      const id = this.usuario.id;
      this.usuarioService.update(id, payload).subscribe({
        next: (res) => {
          this.usuario = res;
          this.actualizar.emit(res);
          this.notificacionService.success('Perfil actualizado correctamente');
        },
        error: (error) => {
          console.error('[HTTP] Error al actualizar perfil:', error);
          if (error.status === 403) {
            this.notificacionService.error('No tienes permisos para actualizar este perfil.');
          } else if (error.status === 409) {
            this.notificacionService.error('El email ya está en uso por otro usuario');
          } else {
            this.notificacionService.error('Error al actualizar el perfil');
          }
        }
      });
    } else {
      this.actualizar.emit({ ...this.usuario, ...payload });
    }
  }

  // Crea input file temporal para seleccionar archivo sin mantenerlo en template
  openFileSelector(): void {
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
   * Si el usuario tiene ID (usuario existente):
   * - Sube la foto al backend usando `SubidaArchivosService.subirFotoPerfil()`.
   * - Actualiza el objeto `usuario` con la respuesta del servidor.
   * - Emite el evento `subirFoto` para notificar al componente padre.
   * - Muestra notificación de éxito.
   * - Maneja errores específicos:
   *   - 413: Archivo supera 5 MB
   *   - 403: Sin permisos
   *   - Otros: Error genérico
   * - En caso de error, revierte la preview a la foto original del usuario.
   * 
   * Si el usuario no tiene ID (modo creación):
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

    // Si existe usuario con id, sube usando el servicio especializado
    if (this.usuario?.id) {
      this.subidaArchivosService.subirFotoPerfil(this.usuario.id, file).subscribe({
        next: (res) => {
          this.usuario = res;
          this.subirFoto.emit(file);
          this.actualizar.emit(res);
          this.notificacionService.success('Foto actualizada correctamente');
        },
        error: (error) => {
          console.error('[HTTP] Error al subir foto:', error);
          if (error?.status === 413) {
            this.notificacionService.error('El archivo supera el tamaño máximo permitido (5 MB)');
          } else if (error?.status === 403) {
            this.notificacionService.error('No tienes permisos para cambiar la foto de perfil');
          } else {
            this.notificacionService.error('Error al subir la foto de perfil');
          }
          // Revierte preview
          this.previewUrl = this.usuario?.fotoPerfil;
        }
      });
    } else {
      // sin id de usuario, solo se previsualiza y se emite el archivo
      this.subirFoto.emit(file);
    }
  }

  /**
   * Elimina la foto del perfil.
   * 
   * @remarks
   * Emite el evento `eliminarFoto` para que el componente padre maneje
   * la eliminación de la foto en el backend.
   */
  onEliminarFoto(): void {
    this.eliminarFoto.emit();
  }
}
