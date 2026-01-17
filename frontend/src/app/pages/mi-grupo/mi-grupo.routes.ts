import { Routes } from "@angular/router";

/**
 * Rutas hijas de Mi Grupo
 */
export const MI_GRUPO_RUTAS: Routes = [
  {
    path: "config",
    loadComponent: () => import("../config-grupo/config-grupo").then(m => m.ConfigGrupo),
    title: "Configuración",
    data: { breadcrumb: "Configuración" }
  },
  {
    path: "recursos",
    loadComponent: () => import("../recursos/recursos").then(m => m.Recursos),
    title: "Recursos",
    data: { breadcrumb: "Recursos" }
  },
  {
    path: "miembros",
    loadComponent: () => import("../miembros/miembros").then(m => m.Miembros),
    title: "Miembros",
    data: { breadcrumb: "Miembros" }
  },
  {
    path: "permisos",
    loadComponent: () => import("../permisos/permisos").then(m => m.Permisos),
    title: "Permisos",
    data: { breadcrumb: "Permisos" }
  }
];
