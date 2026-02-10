import { Component, Input } from '@angular/core';
import { MiembroGrupo } from '../../../models';

@Component({
  selector: 'app-card-miembro',
  standalone: true,
  imports: [],
  templateUrl: './card-miembro.html',
  styleUrl: './card-miembro.scss',
})
export class CardMiembro {
  @Input() miembro: MiembroGrupo;
}
