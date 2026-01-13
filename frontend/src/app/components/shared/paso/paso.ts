import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paso.html',
  styleUrls: ['./paso.scss'],
})
export class Paso {
  @Input() numero!: string | number;
  @Input() titulo = '';
  @Input() texto = '';
}
