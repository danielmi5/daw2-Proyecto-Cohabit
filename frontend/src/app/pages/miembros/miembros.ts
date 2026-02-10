import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Spinner } from '../../components/shared/spinner/spinner';
import { CommonModule } from '@angular/common';
import { MiembroGrupoResponse, UsuarioResponse } from '../../models';
import { MiembroGrupoService } from '../../services/miembro-grupo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-miembros',
  imports: [CommonModule, Spinner],
  templateUrl: './miembros.html',
  styleUrl: './miembros.scss',
})
export class Miembros implements OnInit{
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private miembroService = inject(MiembroGrupoService);
  private notificacionService = inject(NotificacionService);
  private router = inject(Router);

  usuarioActual = signal<UsuarioResponse | null>(null);
  miembroActual = signal<MiembroGrupoResponse | null>(null);
  total = 0;
  error = false;
  mensajeError = "";
  cargando = signal<boolean>(true);

  grupoId: number | null = null;
  miembroId: number | null = null;
  
  ngOnInit(): void {
    this.cargarMiembros();
  }

  private cargarMiembros(){
    const usuario = this.authService.usuarioDetalles();
    
    if (!usuario?.miembroGrupoId) {
      this.error = true;
      this.mensajeError = 'No perteneces a ningún grupo';
      this.cargando.set(false);
      return;
    } else{
      this.usuarioActual.set(usuario);
    }

    this.miembroId = usuario.miembroGrupoId;

    this.miembroService.get(usuario.miembroGrupoId).subscribe({
      next: (miembro) => {
        this.miembroActual.set(miembro);
        if (this.grupoId) {
          this.cargarMiembros();
        } else {
          this.error = true;
          this.mensajeError = 'No se pudo obtener el ID del grupo';
          this.cargando.set(false);
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del miembro:', error);
        this.error = true;
        this.mensajeError = 'Error al cargar los datos del grupo';
        this.cargando.set(false);
      }
    });
  }
}
