import { Component } from '@angular/core';

// Componente contenedor principal para el contenido de la aplicación.
// Envuelve el contenido central entre header y footer.
//
// - Componente standalone sin lógica de negocio
// - Proporciona estructura semántica <main> para el contenido
// - Utilizado en el layout principal de la aplicación
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
})
export class Main {

}
