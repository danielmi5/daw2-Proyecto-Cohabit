import { Component, ViewChild } from '@angular/core';
import { RegistroForm } from '../../components/shared/registro-form/registro-form';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
  imports: [RegistroForm]
})
export class RegistroPage {
  @ViewChild(RegistroForm) private formulario?: RegistroForm;

  hayCambiosAuth(): boolean {
    return !!this.formulario && this.formulario.hayCambiosAuth();
  }
}
