import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  @Input() titulo: string = 'Recurso';
  @Input() estado: string = 'Estado';
  @Input() fecha: string | Date | null = null;
  @Input() hora: string | null = null;
  @Input() variante: 'vertical' | 'horizontal' = 'vertical';
  @Input() imagen?: string | null = null;
  @Input() imagenAlt: string = 'Imagen del recurso';

}
