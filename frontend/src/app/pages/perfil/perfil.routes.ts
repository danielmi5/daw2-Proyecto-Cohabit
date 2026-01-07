import { Routes } from "@angular/router";

/**
 * Rutas hijas del Perfil
 */
export const PERFIL_RUTAS: Routes = [
  {
    path: "",
    loadComponent: () => import("../datos-perfil/datos-perfil").then(m => m.DatosPerfil),
    title: "Mis Datos",
    data: { breadcrumb: "Mis Datos" }
  },
  {
    path: "preferencias",
    loadComponent: () => import("../preferencias/preferencias").then(m => m.Preferencias),
    title: "Preferencias",
    data: { breadcrumb: "Preferencias" }
  },
  {
    path: "mi-grupo",
    loadComponent: () => import("../grupo/grupo").then(m => m.Grupo),
    title: "Mi Grupo",
    data: { breadcrumb: "Mi Grupo" }
  },
  {
    path: "seguridad",
    loadComponent: () => import("../seguridad/seguridad").then(m => m.Seguridad),
    title: "Seguridad",
    data: { breadcrumb: "Seguridad" }
  }
];
