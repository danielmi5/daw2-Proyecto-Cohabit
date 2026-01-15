import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatherIconDirective } from '../../directives/feather-icon.directive';

@Component({
  selector: 'app-mis-reservas',
  imports: [RouterLink, FeatherIconDirective],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.scss',
})
export class MisReservas {

}
