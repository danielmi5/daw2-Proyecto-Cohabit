import { Component } from '@angular/core';
import { FormInput } from "../../components/shared/form-input/form-input";
import { Sidebar } from '../../components/layout/sidebar/sidebar';

@Component({
  selector: 'app-componentes',
  templateUrl: './componentes.html',
  styleUrl: './componentes.scss',
  imports: [FormInput, Sidebar]
})
export class ComponentesPage {}
