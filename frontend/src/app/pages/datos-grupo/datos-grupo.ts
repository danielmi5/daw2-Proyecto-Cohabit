import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGrupo } from '../../components/pages/data-grupo/data-grupo';
import { AuthService } from '../../services/auth.service';
import { GrupoService } from '../../services/grupo.service';
import { NotificacionService } from '../../services/notificacion.service';
import { MiembroGrupoService } from '../../services/miembro-grupo.service';
import { GrupoResponse } from '../../models/grupo.model';

@Component({
  selector: 'app-datos-grupo',
  standalone: true,
  imports: [CommonModule, DataGrupo],
  templateUrl: './datos-grupo.html',
  styleUrl: './datos-grupo.scss',
})
export class DatosGrupo implements OnInit {
  private authService = inject(AuthService);
  private grupoService = inject(GrupoService);
  private miembroGrupoService = inject(MiembroGrupoService);
  private notificacionService = inject(NotificacionService);

  grupoActual = signal<GrupoResponse | null>(null);
  miembroActual = signal<import('../../models/miembro-grupo.model').MiembroGrupoResponse | null>(null);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarDatosGrupo();
  }

  private cargarDatosGrupo(): void {
    const usuario = this.authService.usuarioDetalles();

    if (usuario?.miembroGrupoId) {
      this.cargarGrupo(usuario.miembroGrupoId);
    } else {
      this.cargando.set(false);
    }
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
              console.error('Error al cargar grupo:', error);
              this.notificacionService.error('Error al cargar los datos del grupo');
              this.cargando.set(false);
            }
          });
        } else {
          this.cargando.set(false);
        }
      },
      error: (error) => {
        console.error('Error al cargar miembro del grupo:', error);
        this.notificacionService.error('Error al cargar los datos del grupo');
        this.cargando.set(false);
      }
    });
  }

  actualizarGrupo(grupoActualizado: GrupoResponse): void {
    this.grupoActual.set(grupoActualizado);
    this.notificacionService.success('Datos del grupo actualizados correctamente');
  }

  subirFotoGrupo(archivo: File): void {
    // Por ahora solo loguea; DataGrupo ya sube el archivo si existe id
    console.log('Foto subida:', archivo);
  }

  eliminarFotoGrupo(): void {
    if (this.grupoActual() && this.grupoActual()?.id) {
      const id = this.grupoActual()!.id!;
      this.grupoService.update(id, { fotoGrupo: undefined }).subscribe({
        next: (grupo) => {
          this.grupoActual.set(grupo);
          this.notificacionService.success('Foto eliminada correctamente');
        },
        error: (error) => {
          console.error('Error al eliminar foto:', error);
          this.notificacionService.error('Error al eliminar la foto del grupo');
        }
      });
    }
  }
}
