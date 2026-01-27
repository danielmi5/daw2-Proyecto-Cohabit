import { Component, ViewChild } from '@angular/core';
import { LoginForm } from '../../components/shared/login-form/login-form';

// Página de login (protegida con salirAuthGuard para confirmar salida con cambios sin guardar)
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
