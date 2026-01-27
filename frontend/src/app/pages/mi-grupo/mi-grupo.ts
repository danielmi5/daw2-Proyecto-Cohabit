import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from "../../components/layout/sidebar/sidebar";
import { ModalGrupo } from '../../components/shared/modal-grupo/modal-grupo';
import { AuthService } from '../../services/auth.service';
import { GrupoService } from '../../services/grupo.service';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-mi-grupo',
  imports: [CommonModule, RouterOutlet, Sidebar, ModalGrupo],
  templateUrl: './mi-grupo.html',
  styleUrls: ['./mi-grupo.scss'],
})
export class MiGrupo implements OnInit {
  // Página Mi Grupo: verifica pertenencia a grupo, permite crear uno con modal si no existe
  private authService = inject(AuthService);
  private grupoService = inject(GrupoService);
  private notificacionService = inject(NotificacionService);
  private router = inject(Router);

  tieneGrupo = signal<boolean>(false);
  mostrarModal = signal<boolean>(false);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.verificarGrupo();
  }

  private verificarGrupo(): void {
    this.authService.cargarUsuarioDesdeToken().subscribe({
      next: () => this.checkUsuario(),
      error: () => this.checkUsuario()
    });
  }

  private checkUsuario(): void {
    const usuario = this.authService.usuarioDetalles();
    
    if (usuario && usuario.miembroGrupoId) {
      this.tieneGrupo.set(true);
      this.cargando.set(false);
    } else {
      this.tieneGrupo.set(false);
      this.cargando.set(false);
    }
  }

  abrirModal(): void {
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    if (!this.tieneGrupo()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.mostrarModal.set(false);
    }
  }

  crearGrupo(datos: any): void {
    const usuario = this.authService.usuarioActual();

    if (!usuario?.id) {
      this.notificacionService.error('No se pudo identificar al usuario');
      return;
    }

    const grupoRequest = {
      nombre: datos.nombre,
      direccion: datos.direccion || '',
      descripcion: datos.descripcion || '',
      creadorId: usuario.id
    };

    this.grupoService.create(grupoRequest).subscribe({
      next: () => {
        this.authService.cargarUsuarioDesdeToken().subscribe({
          next: () => {
            this.notificacionService.success('Grupo creado exitosamente');
            this.mostrarModal.set(false);
            this.tieneGrupo.set(true);
            this.router.navigate(['/grupo']);
          },
          error: () => {
            this.notificacionService.success('Grupo creado exitosamente');
            this.mostrarModal.set(false);
            this.tieneGrupo.set(true);
            this.router.navigate(['/dashboard/mi-grupo']);
          }
        });
      },
      error: (error) => {
        console.error('Error al crear grupo:', error);
        this.notificacionService.error('Error al crear el grupo. Inténtalo de nuevo.');
      }
    });
  }
}