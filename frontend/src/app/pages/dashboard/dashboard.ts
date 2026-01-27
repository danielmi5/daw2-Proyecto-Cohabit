import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/layout/sidebar/sidebar';

// Contenedor del dashboard con sidebar y RouterOutlet (protegido con authGuard)
@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {

}
