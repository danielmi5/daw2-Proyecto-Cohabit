import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Accordion } from '../../components/shared/accordion/accordion';
import { AccordionItem } from '../../components/shared/accordion/accordion-item';
import { FeatherIconDirective } from '../../directives/feather-icon.directive';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Accordion, AccordionItem, FeatherIconDirective],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {

}
