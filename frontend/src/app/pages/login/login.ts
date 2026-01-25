import { Component, ViewChild } from '@angular/core';
import { LoginForm } from '../../components/shared/login-form/login-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [LoginForm]
})
export class LoginPage {
  @ViewChild(LoginForm) private formulario?: LoginForm;

  hayCambiosAuth(): boolean {
    return !!this.formulario && this.formulario.hayCambiosAuth();
  }
}
