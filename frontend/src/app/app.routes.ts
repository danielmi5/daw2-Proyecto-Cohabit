import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'dashboard', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) },
];
