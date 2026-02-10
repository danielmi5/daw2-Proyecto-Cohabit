import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Spinner } from '../../components/shared/spinner/spinner';
import { CommonModule } from '@angular/common';
import { MiembroGrupoResponse, UsuarioResponse } from '../../models';
import { MiembroGrupoService } from '../../services/miembro-grupo.service';
import { Router } from '@angular/router';
import { GrupoService } from '../../services/grupo.service';
import { Button } from "../../components/shared/button/button";
import { CardMiembro } from "../../components/shared/card-miembro/card-miembro";
import { ListaMiembros } from "../../components/shared/lista-miembros/lista-miembros";

@Component({
  selector: 'app-miembros',
  imports: [CommonModule, Spinner, Button, CardMiembro, ListaMiembros],
  templateUrl: './miembros.html',
  styleUrl: './miembros.scss',
})
export class Miembros implements OnInit{
  private authService = inject(AuthService);
  private miembroService = inject(MiembroGrupoService);
  private usuarioService = inject(UsuarioService);
  private notificacionService = inject(NotificacionService);
  private grupoService = inject(GrupoService);
  private router = inject(Router);

  usuarioActual = signal<UsuarioResponse | null>(null);
  miembroActual = signal<MiembroGrupoResponse | null>(null);
  miembros: MiembroGrupoResponse[] = [];
  total = 0;
  error = false;
  mensajeError = "";
  cargando = signal<boolean>(true);

  grupoId: number | null = null;
  miembroId: number | null = null;
  
  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(){
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
        this.grupoId = miembro.grupoId || null;
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

  cargarMiembros(): void{
    if (!this.grupoId) {
      this.error = true;
      this.mensajeError = 'No se ha podido identificar el grupo';
      this.cargando.set(false);
      return;
    }

    this.cargando.set(true);
    this.error = false;

    this.grupoService.obtenerMiembros(this.grupoId).subscribe({
      next: (res) => {
        this.miembros = res.items || [];
        this.total = res.total || this.miembros.length;
        this.cargando.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar miembros:', error);
        this.error = true;
        this.mensajeError = error.message || 'Error al cargar los miembros';
        this.cargando.set(false);
      }
    });
  }

  /*
  obtenerUsuario(id: number): UsuarioResponse{
    
    this.usuarioService.get(id).subscribe({
        next: (user) => {
          usuario = user;
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar usuario:', error);
          this.notificacionService.error('Error al cargar los datos del usuario');
          this.cargando.set(false);
        }
      });
    return usuario;
    
  }*/

  retry(): void {
    this.cargarDatosUsuario();
  }

  goToMyGroup():void {
    this.router.navigate(['/grupo']);
  }
}

