import { Component } from '@angular/core';
import { RegistroForm } from '../../components/shared/registro-form/registro-form';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
  imports: [RegistroForm]
})
export class RegistroPage {}
