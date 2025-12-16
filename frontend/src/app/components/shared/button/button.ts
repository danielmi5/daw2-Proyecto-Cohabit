import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variante: 'primario' | 'secundario' | 'fantasma' | 'peligro' = 'primario';
  @Input() tamanio: 'pequeno' | 'mediano' | 'grande' = 'mediano';
  @Input() deshabilitado: boolean = false;
  @Input() tipo: 'button' | 'submit' | 'reset' = 'button';
  @Input() tieneIcono: boolean = false;
  @Input() ariaLabel?: string;
}
