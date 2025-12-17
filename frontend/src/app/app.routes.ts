import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { StyleGuidePage } from './pages/style-guide/style-guide';
import { LoginPage } from './pages/login/login';
import { RegistroPage } from './pages/registro/registro';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'style-guide', component: StyleGuidePage },
  { path: 'login', component: LoginPage },
  { path: 'registro', component: RegistroPage },
  { path: 'dashboard', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) },
];
