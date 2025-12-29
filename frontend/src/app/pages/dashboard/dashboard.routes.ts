import { Routes } from "@angular/router";

/**
 * Rutas hijas del Dashboard
 */
export const DASHBOARD_RUTAS: Routes = [
  {
    path: "",
    redirectTo: "reservas",
    pathMatch: "full"
  },
  {
    path: "reservas",
    loadComponent: () => import("../reservas/reservas").then(m => m.Reservas),
    title: "Reservas",
    data: { breadcrumb: "Reservas" }
  },
  {
    path: "mis-reservas",
    loadComponent: () => import("../mis-reservas/mis-reservas").then(m => m.MisReservas),
    title: "Mis Reservas",
    data: { breadcrumb: "Mis Reservas" }
  },
  {
    path: "calendario",
    loadComponent: () => import("../calendario/calendario").then(m => m.Calendario),
    title: "Calendario",
    data: { breadcrumb: "Calendario" }
  }
];
