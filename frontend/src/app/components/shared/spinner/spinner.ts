import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrls: ['./spinner.scss'],
})
export class Spinner {
  @Input() tamanio: 'pequeno' | 'mediano' | 'grande' = 'mediano';
  @Input() texto = 'Cargando...';

  

  get claseTamanio(): string {
    return `spinner--${this.tamanio}`;
  }
}
