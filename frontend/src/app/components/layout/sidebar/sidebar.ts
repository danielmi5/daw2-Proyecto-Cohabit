import { Component, Input, OnInit, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { Tooltip } from '../../shared/tooltip/tooltip';
import { AuthService } from '../../../services/auth.service';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FeatherIconDirective, Tooltip],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar implements OnInit {
  @Input() variante: 'dashboard' | 'grupo' | 'perfil' = 'dashboard';

  private authService = inject(AuthService);
  private notificacionService = inject(NotificacionService);
  private router = inject(Router);
  
  // Computed para mostrar opciones de perfil automáticamente cuando variante es 'perfil'
  mostrarOpcionesPerfil = computed(() => this.variante === 'perfil');
  
  // Computed signals para obtener los datos del usuario
  nombreUsuario = computed(() => {
    const usuario = this.authService.usuarioDetalles();
    if (usuario?.nombre && usuario?.apellidos) {
      return `${usuario.nombre} ${usuario.apellidos}`;
    }
    return usuario?.nombre || 'COHABIT';
  });

  imagenPerfil = computed(() => {
    const usuario = this.authService.usuarioDetalles();
    return usuario?.fotoPerfil;
  });

  ngOnInit(): void {
    // El AuthService ya debería tener los datos del usuario cargados
  }

  cerrarSesion(): void {
    try {
      this.authService.cerrarSesion();
      this.notificacionService.success('Se ha cerrado la sesión correctamente');
      this.router.navigate(['/login']);
    } catch (error) {
      this.notificacionService.error('Ha ocurrido un error. No se ha podido cerrar sesión.');
    }
  }
}
