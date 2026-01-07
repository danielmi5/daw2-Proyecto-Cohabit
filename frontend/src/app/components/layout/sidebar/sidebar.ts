import { Component, Input, OnInit, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { Tooltip } from '../../shared/tooltip/tooltip';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FeatherIconDirective, Tooltip],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar implements OnInit {
  @Input() mostrarOpcionesPerfil: boolean = false;
  @Input() variante: 'dashboard' | 'grupo' | 'perfil' = 'dashboard';

  private authService = inject(AuthService);
  
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
    return usuario?.fotoPerfil || 'img/icono-perfil.svg';
  });

  ngOnInit(): void {
    // El AuthService ya debería tener los datos del usuario cargados
  }
}
