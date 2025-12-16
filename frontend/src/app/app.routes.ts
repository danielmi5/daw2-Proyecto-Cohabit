import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { StyleGuidePage } from './pages/style-guide/style-guide';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'style-guide', component: StyleGuidePage },
  { path: 'dashboard', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) },
];
