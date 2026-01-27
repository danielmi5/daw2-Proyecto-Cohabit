import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from "../../components/layout/sidebar/sidebar";
import { ModalGrupo } from '../../components/shared/modal-grupo/modal-grupo';
import { AuthService } from '../../services/auth.service';
import { GrupoService } from '../../services/grupo.service';
import { NotificacionService } from '../../services/notificacion.service';
import { ApiService } from '../../services/api.service';
import { Button } from "../../components/shared/button/button";
import { FormInput } from "../../components/shared/form-input/form-input";

@Component({
  selector: 'app-mi-grupo',
  imports: [CommonModule, RouterOutlet, Sidebar, ModalGrupo, Button, FormInput],
  templateUrl: './mi-grupo.html',
  styleUrls: ['./mi-grupo.scss'],
})
export class MiGrupo implements OnInit {
  // Página Mi Grupo: verifica pertenencia a grupo, permite crear uno con modal si no existe
  private authService = inject(AuthService);
  private grupoService = inject(GrupoService);
  private notificacionService = inject(NotificacionService);
  private router = inject(Router);
  private api = inject(ApiService);

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

  unirGrupo(codigo: string): void {
    const codigoTrim = (codigo || '').trim();
    if (!codigoTrim) {
      this.notificacionService.error('Introduce un código de invitación válido');
      return;
    }

    const payload = { codigoInvitacion: codigoTrim };
    this.api.post('/api/miembros/unirse', payload).subscribe({
      next: () => {
        this.notificacionService.success('Te has unido al grupo correctamente');
        // Recarga el usuario para actualizar estado
        this.authService.cargarUsuarioDesdeToken().subscribe({
          next: () => {
            this.tieneGrupo.set(true);
            this.mostrarModal.set(false);
            this.router.navigate(['/grupo']);
          },
          error: () => {
            this.tieneGrupo.set(true);
            this.router.navigate(['/grupo']);
          }
        });
      },
      error: (err) => {
        console.error('Error al unirse al grupo:', err);
           if (err?.status === 404) {
             this.notificacionService.error('No hay grupo existente con ese código');
             return;
           }
           
           const msg = err?.error?.mensaje || err?.mensaje || 'No se pudo unir al grupo. Verifica el código.';
           this.notificacionService.error(msg);
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
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