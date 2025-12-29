import { Routes } from "@angular/router";

/**
 * Rutas hijas del Perfil
 */
export const PERFIL_RUTAS: Routes = [
  {
    path: "",
    redirectTo: "preferencias",
    pathMatch: "full"
  },
  {
    path: "preferencias",
    loadComponent: () => import("../preferencias/preferencias").then(m => m.Preferencias),
    title: "Preferencias",
    data: { breadcrumb: "Preferencias" }
  },
  {
    path: "grupo",
    loadComponent: () => import("../grupo/grupo").then(m => m.Grupo),
    title: "Grupo",
    data: { breadcrumb: "Grupo" }
  },
  {
    path: "seguridad",
    loadComponent: () => import("../seguridad/seguridad").then(m => m.Seguridad),
    title: "Seguridad",
    data: { breadcrumb: "Seguridad" }
  }
];
