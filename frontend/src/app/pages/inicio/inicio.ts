import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Accordion } from '../../components/shared/accordion/accordion';
import { AccordionItem } from '../../components/shared/accordion/accordion-item';
import { Paso } from '../../components/shared/paso/paso';
import { Caracteristica } from '../../components/shared/caracteristica/caracteristica';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Accordion, AccordionItem, Paso, Caracteristica],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss'],
})
export class Inicio {
  authService = inject(AuthService);
}
