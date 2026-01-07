import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPerfil } from '../../components/pages/data-perfil/data-perfil';
import { Spinner } from '../../components/shared/spinner/spinner';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { NotificacionService } from '../../services/notificacion.service';
import { UsuarioResponse } from '../../models/usuario.model';

@Component({
  selector: 'app-datos-perfil',
  standalone: true,
  imports: [CommonModule, DataPerfil, Spinner],
  templateUrl: './datos-perfil.html',
  styleUrls: ['./datos-perfil.scss'],
})
export class DatosPerfil implements OnInit {
  // Página de edición de datos del perfil. Carga usuario actual y muestra DataPerfil para editar campos y foto.
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private notificacionService = inject(NotificacionService);

  usuarioActual = signal<UsuarioResponse | null>(null);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarDatosPerfil();
  }

  private cargarDatosPerfil(): void {
    const usuario = this.authService.usuarioDetalles();

    if (usuario?.id) {
      this.usuarioService.get(usuario.id).subscribe({
        next: (user) => {
          this.usuarioActual.set(user);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar usuario:', error);
          this.notificacionService.error('Error al cargar los datos del perfil');
          this.cargando.set(false);
        }
      });
    } else {
      this.cargando.set(false);
    }
  }

  actualizarPerfil(usuarioActualizado: UsuarioResponse): void {
    this.usuarioActual.set(usuarioActualizado);
    this.notificacionService.success('Datos del perfil actualizados correctamente');
    
    // Actualizar también en authService si es el usuario actual
    if (usuarioActualizado.id === this.authService.usuarioDetalles()?.id) {
      this.authService.usuarioDetalles.set(usuarioActualizado);
    }
  }

  subirFotoPerfil(archivo: File): void {
    // Por ahora solo loguea; DataPerfil ya sube el archivo si existe id
    console.log('Foto subida:', archivo);
  }

  eliminarFotoPerfil(): void {
    if (this.usuarioActual() && this.usuarioActual()?.id) {
      const id = this.usuarioActual()!.id!;
      this.usuarioService.update(id, { fotoPerfil: undefined }).subscribe({
        next: (usuario) => {
          this.usuarioActual.set(usuario);
          this.notificacionService.success('Foto eliminada correctamente');
          
          // Actualizar también en authService si es el usuario actual
          if (usuario.id === this.authService.usuarioDetalles()?.id) {
            this.authService.usuarioDetalles.set(usuario);
          }
        },
        error: (error) => {
          console.error('Error al eliminar foto:', error);
          this.notificacionService.error('Error al eliminar la foto de perfil');
        }
      });
    }
  }
}
