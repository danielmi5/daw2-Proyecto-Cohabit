import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { GrupoService } from '../../services/grupo.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Button } from '../../components/shared/button/button';
import { ModalGrupo } from '../../components/shared/modal-grupo/modal-grupo';
import { UsuarioResponse } from '../../models/usuario.model';

@Component({
  selector: 'app-mi-grupo',
  imports: [RouterOutlet, Button, ModalGrupo],
  templateUrl: './mi-grupo.html',
  styleUrl: './mi-grupo.scss',
})
export class MiGrupo implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private grupoService = inject(GrupoService);
  private notificacionService = inject(NotificacionService);

  usuarioActual = signal<UsuarioResponse | null>(null);
  tieneGrupo = signal<boolean>(false);
  mostrarModal = signal<boolean>(false);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarUsuario();
  }

  private cargarUsuario(): void {
    const usuario = this.authService.usuarioActual();
    const idUsuario = usuario?.id;

    if (idUsuario !== null && idUsuario !== undefined) {
      this.usuarioService.get(idUsuario).subscribe({
        next: (data) => {
          this.usuarioActual.set(data);
          this.tieneGrupo.set(!!data.miembroGrupoId);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error("Error al cargar usuario:", error);
          this.notificacionService.error("Error al cargar los datos del usuario");
          this.cargando.set(false);
        }
      });
      return;
    }

    // Si no se dispone del id, se intenta resolverlo por email (sub) desde el token
    const email = (usuario as any)?.sub as string | undefined;
    if (email) {
      this.usuarioService.getAll(0, 1000).subscribe({
        next: (res) => {
          const encontrado = res.items.find(u => u.email === email) ?? null;
          if (encontrado) {
            this.usuarioActual.set(encontrado);
            this.tieneGrupo.set(!!encontrado.miembroGrupoId);
          } else {
            this.usuarioActual.set(null);
            this.tieneGrupo.set(false);
          }
          this.cargando.set(false);
        },
        error: (error) => {
          console.error("Error al buscar usuario por email:", error);
          this.notificacionService.error("Error al cargar los datos del usuario");
          this.cargando.set(false);
        }
      });
      return;
    }

    this.cargando.set(false);
  }

  abrirModal(): void {
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  crearGrupo(datos: any): void {
    const usuario = this.authService.usuarioActual();

    const enviarCreacion = (creadorId: number) => {
      const grupoRequest = {
        nombre: datos.nombre,
        direccion: datos.direccion || "",
        descripcion: datos.descripcion || "",
        creadorId
      };

      this.grupoService.create(grupoRequest).subscribe({
        next: () => {
          this.notificacionService.success("Grupo creado exitosamente");
          this.cerrarModal();
          // Se recargan los datos del usuario para actualizar miembroGrupoId
          this.cargarUsuario();
        },
        error: (error) => {
          console.error("Error al crear grupo:", error);
          this.notificacionService.error("Error al crear el grupo. Inténtalo de nuevo.");
        }
      });
    };

    // Si ya se dispone del id del usuario, se utiliza.
    if (usuario?.id) {
      enviarCreacion(usuario.id);
      return;
    }

    // Si no, se intenta resolver el id a partir del email (sub) consultando la lista de usuarios.
    const email = usuario?.sub as unknown as string | undefined;
    if (email) {
      this.usuarioService.getAll(0, 1000).subscribe({
        next: (res) => {
          const encontrado = res.items.find(u => u.email === email);
          if (encontrado && encontrado.id) {
            enviarCreacion(encontrado.id);
          } else {
            this.notificacionService.error("No se encontró el usuario para asignar como creador");
          }
        },
        error: (err) => {
          console.error("Error al obtener usuarios:", err);
          this.notificacionService.error("Error al identificar al usuario");
        }
      });
      return;
    }

    this.notificacionService.error("No se pudo identificar al usuario");
  }
}
