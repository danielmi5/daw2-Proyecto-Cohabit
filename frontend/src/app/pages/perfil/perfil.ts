import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/layout/sidebar/sidebar';

// Contenedor del perfil con sidebar y RouterOutlet (protegido con authGuard)
@Component({
  selector: 'app-perfil',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss'],
})
export class Perfil {

}

