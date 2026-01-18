import { Component, OnInit, inject, signal } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { GrupoService } from '../../services/grupo.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Button } from '../../components/shared/button/button';
import { ModalGrupo } from '../../components/shared/modal-grupo/modal-grupo';
import { DataGrupo } from '../../components/pages/data-grupo/data-grupo';
import { UsuarioResponse } from '../../models/usuario.model';
import { GrupoResponse } from '../../models/grupo.model';
import { MiembroGrupoService } from '../../services/miembro-grupo.service';
import { Sidebar } from "../../components/layout/sidebar/sidebar";

@Component({
  selector: 'app-mi-grupo',
  imports: [Button, ModalGrupo, DataGrupo, Sidebar],
  templateUrl: './mi-grupo.html',
  styleUrl: './mi-grupo.scss',
})
export class MiGrupo implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private grupoService = inject(GrupoService);
  private miembroGrupoService = inject(MiembroGrupoService);
  private notificacionService = inject(NotificacionService);

  usuarioActual = this.authService.usuarioDetalles;
  grupoActual = signal<GrupoResponse | null>(null);
  miembroActual = signal<import('./../../models/miembro-grupo.model').MiembroGrupoResponse | null>(null);
  tieneGrupo = signal<boolean>(false);
  mostrarModal = signal<boolean>(false);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarUsuario();
  }

  private cargarUsuario(): void {
    const usuario = this.authService.usuarioDetalles();

    if (usuario) {
      // Si ya tenemos los datos del usuario, cargamos el grupo
      this.tieneGrupo.set(!!usuario.miembroGrupoId);
      if (usuario.miembroGrupoId) {
        this.cargarGrupo(usuario.miembroGrupoId);
      } else {
        this.cargando.set(false);
      }
    } else {
      // Si aún no se han cargado los datos del usuario, esperamos un poco y volvemos a intentar
      const checkUsuario = setInterval(() => {
        const usuarioActualizado = this.authService.usuarioDetalles();
        if (usuarioActualizado) {
          clearInterval(checkUsuario);
          this.tieneGrupo.set(!!usuarioActualizado.miembroGrupoId);
          if (usuarioActualizado.miembroGrupoId) {
            this.cargarGrupo(usuarioActualizado.miembroGrupoId);
          } else {
            this.cargando.set(false);
          }
        }
      }, 100);
    }
  }

  abrirModal(): void {
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  crearGrupo(datos: any): void {
    const usuario = this.authService.usuarioActual();

    if (!usuario?.id) {
      this.notificacionService.error("No se pudo identificar al usuario");
      return;
    }

    const grupoRequest = {
      nombre: datos.nombre,
      direccion: datos.direccion || "",
      descripcion: datos.descripcion || "",
      creadorId: usuario.id
    };

    this.grupoService.create(grupoRequest).pipe(
      switchMap(() => this.authService.cargarUsuarioDesdeToken())
    ).subscribe({
      next: (usuario) => {
        this.notificacionService.success("Grupo creado exitosamente");
        this.cerrarModal();
        // Ahora que el usuario está actualizado, cargar el grupo
        this.cargarUsuario();
      },
      error: (error) => {
        console.error("Error al crear grupo:", error);
        this.notificacionService.error("Error al crear el grupo. Inténtalo de nuevo.");
      }
    });
  }

  private cargarGrupo(miembroGrupoId: number): void {
    this.miembroGrupoService.get(miembroGrupoId).subscribe({
      next: (miembro) => {
        this.miembroActual.set(miembro);
        if (miembro.grupoId) {
          this.grupoService.get(miembro.grupoId).subscribe({
            next: (grupo) => {
              this.grupoActual.set(grupo);
              this.cargando.set(false);
            },
            error: (error) => {
              console.error("Error al cargar grupo:", error);
              this.notificacionService.error("Error al cargar los datos del grupo");
              this.cargando.set(false);
            }
          });
        } else {
          this.cargando.set(false);
        }
      },
      error: (error) => {
        console.error("Error al cargar miembro del grupo:", error);
        this.notificacionService.error("Error al cargar los datos del grupo");
        this.cargando.set(false);
      }
    });
  }

  actualizarGrupo(grupoActualizado: GrupoResponse): void {
    this.grupoActual.set(grupoActualizado);
    this.notificacionService.success("Datos del grupo actualizados correctamente");
  }

  subirFotoGrupo(archivo: File): void {
    console.log("Foto subida:", archivo);
  }

  eliminarFotoGrupo(): void {
    if (this.grupoActual() && this.grupoActual()?.id) {
      const id = this.grupoActual()!.id!;
      this.grupoService.update(id, { fotoGrupo: undefined }).subscribe({
        next: (grupo) => {
          this.grupoActual.set(grupo);
          this.notificacionService.success("Foto eliminada correctamente");
        },
        error: (error) => {
          console.error("Error al eliminar foto:", error);
          this.notificacionService.error("Error al eliminar la foto del grupo");
        }
      });
    }
  }
}