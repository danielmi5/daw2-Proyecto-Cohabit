import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { ComponentesPage } from './pages/componentes/componentes';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'componentes', component: ComponentesPage },
  { path: 'dashboard', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) },
];
