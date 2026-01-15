import { Routes } from "@angular/router";
import { reservasResolver } from "../../resolvers/reservas.resolver";

/**
 * Rutas hijas del Dashboard
 */
export const DASHBOARD_RUTAS: Routes = [
  {
    path: "",
    loadComponent: () => import("../../components/shared/dashboard-index/dashboard-index").then(m => m.DashboardIndex),
    title: "Dashboard"
  },
  {
    path: "reservas",
    loadComponent: () => import("../reservas/reservas").then(m => m.Reservas),
    title: "Reservas",
    data: { breadcrumb: "Reservas" },
    resolve: {
      reservasData: reservasResolver
    }
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
