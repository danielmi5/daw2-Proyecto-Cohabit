import { Routes } from "@angular/router";
import { Inicio } from "./pages/inicio/inicio";
import { StyleGuidePage } from "./pages/style-guide/style-guide";
import { LoginPage } from "./pages/login/login";
import { RegistroPage } from "./pages/registro/registro";
import { salirAuthGuard } from './guards/salir-auth-guard';
import { authGuard } from "./guards/auth-guard";

/**
 * Configuración de rutas de la aplicación
 * 
 * Estructura:
 * - Rutas públicas: inicio, login, registro
 * - Rutas privadas (protegidas con authGuard): dashboard, mi-grupo, perfil
 * - Lazy loading: dashboard y mi-grupo cargan sus hijos dinámicamente
 */
export const routes: Routes = [
  // RUTAS PÚBLICAS (sin autenticación)
  {
    path: "",
    component: Inicio,
    title: "Inicio",
    data: { breadcrumb: "Inicio" }
  },
  {
    path: "inicio",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginPage,
    title: "Inicio Sesión",
    data: { breadcrumb: "Login" },
    canDeactivate: [salirAuthGuard]
  },
  {
    path: "registro",
    component: RegistroPage,
    title: "Registro",
    data: { breadcrumb: "Registro" },
    canDeactivate: [salirAuthGuard]
  },
  {
    path: "style-guide",
    component: StyleGuidePage,
    title: "Guía de Estilos",
    data: { breadcrumb: "Style Guide" }
  },
  {
    path: "ayuda",
    loadComponent: () => import("./pages/ayuda/ayuda").then(m => m.Ayuda),
    title: "Ayuda",
    data: { breadcrumb: "Ayuda" }
  },

  // RUTAS PRIVADAS (requieren autenticación)
  {
    path: "dashboard",
    loadComponent: () => import("./pages/dashboard/dashboard").then(m => m.Dashboard),
    canActivate: [authGuard],
    title: "Dashboard",
    data: { breadcrumb: "Dashboard" },
    children: [
      {
        path: "",
        loadChildren: () => import("./pages/dashboard/dashboard.routes").then(m => m.DASHBOARD_RUTAS)
      }
    ]
  },
  {
    path: "mi-grupo",
    loadComponent: () => import("./pages/mi-grupo/mi-grupo").then(m => m.MiGrupo),
    canActivate: [authGuard],
    title: "Mi Grupot",
    data: { breadcrumb: "Mi Grupo" },
    children: [
        {
          path: "",
          loadChildren: () => import("./pages/mi-grupo/mi-grupo.routes").then(m => m.MI_GRUPO_RUTAS)
        }
    ]
  },
  {
    path: "perfil",
    loadComponent: () => import("./pages/perfil/perfil").then(m => m.Perfil),
    canActivate: [authGuard],
    title: "Mi Perfil",
    data: { breadcrumb: "Perfil" },
    children: [
      {
        path: "",
        loadChildren: () => import("./pages/perfil/perfil.routes").then(m => m.PERFIL_RUTAS)
      }
    ]
  },

  // RUTA WILDCARD (página no encontrada)
  {
    path: "**",
    loadComponent: () => import("./pages/not-found/not-found").then(m => m.NotFound),
    title: "Página no encontrada",
    data: { breadcrumb: "404" }
  }
];
