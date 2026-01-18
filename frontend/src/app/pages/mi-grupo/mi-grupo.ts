import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "../../components/layout/sidebar/sidebar";

@Component({
  selector: 'app-mi-grupo',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './mi-grupo.html',
  styleUrl: './mi-grupo.scss',
})
export class MiGrupo {
  // Componente layout: la lógica específica del grupo se gestiona en `DatosGrupo`
}