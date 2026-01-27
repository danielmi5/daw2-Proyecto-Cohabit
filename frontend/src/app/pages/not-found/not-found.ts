import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Página 404 (ruta wildcard **)
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.scss'],
})
export class NotFound {

}
