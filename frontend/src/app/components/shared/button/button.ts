import { Component, Input } from '@angular/core';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [FeatherIconDirective],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class Button {
  @Input() variante: 'primario' | 'secundario' | 'fantasma' | 'peligro' = 'primario';
  @Input() tamanio: 'pequeno' | 'mediano' | 'grande' = 'mediano';
  @Input() deshabilitado: boolean = false;
  @Input() tipo: 'button' | 'submit' | 'reset' = 'button';
  @Input() tieneIcono: boolean = false;
  @Input() ariaLabel?: string;
}