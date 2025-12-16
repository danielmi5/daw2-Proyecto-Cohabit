import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  @Input() nombreUsuario: string = 'COHABIT';
  @Input() imagenPerfil: string = '';
  @Input() mostrarOpcionesPerfil: boolean = false;
}
