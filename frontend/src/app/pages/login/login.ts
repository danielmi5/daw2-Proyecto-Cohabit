import { Component } from '@angular/core';
import { LoginForm } from '../../components/shared/login-form/login-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [LoginForm]
})
export class LoginPage {}
