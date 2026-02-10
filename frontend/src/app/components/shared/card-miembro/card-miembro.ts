import { Component, inject, Input, signal } from '@angular/core';
import { MiembroGrupoResponse, UsuarioResponse } from '../../../models';

@Component({
  selector: 'app-card-miembro',
  standalone: true,
  imports: [],
  templateUrl: './card-miembro.html',
  styleUrl: './card-miembro.scss',
})
export class CardMiembro {
  @Input() miembro!: MiembroGrupoResponse;
  //@Input() usuario!: UsuarioResponse;


}


