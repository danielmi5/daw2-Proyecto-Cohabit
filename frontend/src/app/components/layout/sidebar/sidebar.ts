import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { Tooltip } from '../../shared/tooltip/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FeatherIconDirective, Tooltip],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  @Input() nombreUsuario: string = 'COHABIT';
  @Input() imagenPerfil: string = 'img/icono-perfil.svg';
  @Input() mostrarOpcionesPerfil: boolean = false;
  @Input() variante: 'dashboard' | 'grupo' | 'perfil' = 'dashboard';
}
