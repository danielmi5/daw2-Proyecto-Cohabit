# Fase 4: Sistema de rutas y navegación

## Índice
1. [Mapa Completo de Rutas](#mapa-completo-de-rutas)
2. [Estrategia de Lazy Loading](#estrategia-de-lazy-loading)
3. [Guards y Protección de Rutas](#guards-y-protección-de-rutas)
4. [Metadatos de Rutas](#metadatos-de-rutas)

---

## Mapa completo de rutas

### Estructura general

```
/                           (Página de inicio - pública)
├── /login                  (Inicio de sesión - pública)
├── /registro               (Registro de usuario - pública)
├── /style-guide            (Guía de estilos - pública)
├── /ayuda                  (Página de ayuda - pública, lazy)
├── /dashboard              (Dashboard principal - privada, lazy)
│   ├── /
│   ├── /dashboard/reservas
│   ├── /dashboard/mis-reservas
│   └── /dashboard/calendario
├── /mi-grupo               (Gestión de grupo - privada, lazy)
│   ├── /
│   ├── /mi-grupo/config
│   ├── /mi-grupo/recursos
│   ├── /mi-grupo/miembros
│   └── /mi-grupo/permisos
├── /perfil                 (Perfil de usuario - privada, lazy)
│   ├── /          
│   ├── /perfil/preferencias
│   ├── /perfil/grupo
│   └── /perfil/seguridad
└── /**                     (Página 404 - lazy)
```




### Clasificación de rutas

#### Rutas públicas (sin autenticación requerida)
| Path | Descripción | Parámetros / Query | Guard | Resolver |
|------|-------------|--------------------|-------|----------|
| `/` | Página principal (inicio) | - | - | - |
| `/inicio` | Redirección a `/` | - | - | - |
| `/login` | Inicio de sesión | returnUrl (query opcional) | `salirAuthGuard` (canDeactivate) | - |
| `/registro` | Registro de usuario | - | `salirAuthGuard` (canDeactivate) | - |
| `/style-guide` | Guía de estilos (dev) | - | - | - |
| `/ayuda` | Página de ayuda | - | - | - |

#### Rutas privadas (requieren autenticación)
| Path | Descripción | Parámetros / Query | Guard | Resolver |
|------|-------------|--------------------|-------|----------|
| `/dashboard` | Shell del dashboard (padre) | - | `authGuard` (canActivate) | `DashboardResolver` (opcional) |
| `/dashboard/reservas` | Listado de reservas | page, size, filtro (query) | Hereda `authGuard` | `ReservasResolver` (si implementado) |
| `/dashboard/mis-reservas` | Reservas del usuario actual | - | Hereda `authGuard` | `MisReservasResolver` (opcional) |
| `/dashboard/calendario` | Vista de calendario | fecha (query) | Hereda `authGuard` | `CalendarioResolver` (opcional) |
| `/mi-grupo` | Shell de gestión de grupo | - | `authGuard` | `MiGrupoResolver` (opcional) |
| `/mi-grupo/config` | Configuración del grupo | - | Hereda `authGuard` | - |
| `/mi-grupo/recursos` | Recursos del grupo | - | Hereda `authGuard` | `RecursosResolver` (opcional) |
| `/mi-grupo/miembros` | Miembros del grupo | - | Hereda `authGuard` | `MiembrosResolver` (opcional) |
| `/mi-grupo/permisos` | Gestión de permisos | - | Hereda `authGuard` | - |
| `/perfil` | Perfil de usuario (shell) | - | `authGuard` | `PerfilResolver` (opcional) |
| `/perfil/preferencias` | Preferencias del usuario | - | Hereda `authGuard` | - |
| `/perfil/grupo` | Información del grupo del usuario | - | Hereda `authGuard` | - |
| `/perfil/seguridad` | Gestión de seguridad (cambio contraseña, 2FA) | - | Hereda `authGuard` | - |

#### Rutas especiales
| Path | Descripción | Parámetros / Query | Guard | Resolver |
|------|-------------|--------------------|-------|----------|
| `/**` | Página 404 | - | - | - |


## Estrategia de lazy loading

La aplicación utiliza **lazy loading** (carga diferida) para optimizar el rendimiento y reducir el tamaño del bundle inicial. Esta estrategia consiste en cargar componentes y módulos solo cuando el usuario navega a la ruta correspondiente.

### Beneficios:
- **Reducción del bundle inicial**: Solo se carga el código necesario para la página de inicio
- **Tiempo de carga más rápido**: Mejora el First Contentful Paint (FCP)
- **Mejor experiencia de usuario**: Las páginas que el usuario nunca visita no se descargan
- **Code splitting automático**: Angular genera chunks separados para cada módulo lazy

### Niveles de lazy loading

#### 1. Lazy loading de componentes individuales (`loadComponent`)

Utilizado para páginas simples sin rutas hijas:

```typescript
{
  path: "ayuda",
  loadComponent: () => import("./pages/ayuda/ayuda").then(m => m.Ayuda),
  title: "Ayuda",
  data: { breadcrumb: "Ayuda" }
}
```

**Cuándo se usa:**
- Páginas standalone sin sub-navegación
- Páginas públicas de bajo tráfico (ayuda, 404)
- Componentes pesados que no todos los usuarios visitan

**Componentes con esta estrategia:**
- `/ayuda` → `Ayuda`
- `/**` (404) → `NotFound`

#### 2. Lazy Loading de Rutas Padres con Hijos Anidados

Utilizado para secciones completas con sub-navegación:

```typescript
{
  path: "dashboard",
  loadComponent: () => import("./pages/dashboard/dashboard").then(m => m.Dashboard),
  canActivate: [authGuard],
  title: "Dashboard",
  children: [
    {
      path: "",
      loadChildren: () => import("./pages/dashboard/dashboard.routes").then(m => m.DASHBOARD_RUTAS)
    }
  ]
}
```

**Cuándo se usa:**
- Secciones con múltiples páginas relacionadas
- Áreas que comparten layout común (shell)
- Funcionalidades que requieren autenticación

**Secciones con esta estrategia:**
- `/dashboard` → Componente padre + 3 rutas hijas
- `/mi-grupo` → Componente padre + 4 rutas hijas
- `/perfil` → Componente padre + 3 rutas hijas

#### 3. Eager Loading (Carga Inmediata)

Solo para componentes críticos en la experiencia inicial:

```typescript
{
  path: "",
  component: Inicio,
  title: "Inicio",
  data: { breadcrumb: "Inicio" }
}
```

**Componentes con carga inmediata:**
- `/` → `Inicio` (página principal)
- `/login` → `LoginPage` (punto de entrada común)
- `/registro` → `RegistroPage` (punto de entrada común)
- `/style-guide` → `StyleGuidePage` (herramienta de desarrollo)

**Justificación:**
- Son las páginas más visitadas
- Necesarias para el funcionamiento básico
- Pequeñas en tamaño
- Mejoran la percepción de velocidad

### Ejemplo de Rutas Hijas (Dashboard)

**Archivo:** `app/pages/dashboard/dashboard.routes.ts`

```typescript
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
```

**Características:**
- Cada ruta hija usa `loadComponent` para carga diferida
- Redirección automática a una ruta por defecto
- Metadatos para títulos y breadcrumbs
- Imports relativos desde el archivo de rutas

### Carga en Cascada

Cuando un usuario navega a `/dashboard/reservas`:

1. **Primera carga** (si no está cargado):
   ```
   dashboard.component.ts
   dashboard.routes.ts
   ```

2. **Segunda carga** (al resolver ruta hija):
   ```
   reservas.component.ts
   ```

3. **Resultado**: Dos chunks HTTP separados, cargados secuencialmente

### Optimizaciones Implementadas

1. **Preloading Strategy**: Angular permite precargar módulos en segundo plano
   ```typescript
   // Puede configurarse en app.config.ts
   preloadingStrategy: PreloadAllModules
   ```

2. **Route Data**: Metadatos para breadcrumbs y títulos
   ```typescript
   data: { breadcrumb: "Reservas" }
   ```

3. **Path Matching**: Uso estratégico de `pathMatch: "full"` en redirecciones

4. **Guards Heredados**: Los hijos heredan los guards del padre, evitando duplicación

## Guards y Protección de Rutas

### authGuard (canActivate)

**Propósito**: Proteger rutas que requieren autenticación.

**Ubicación**: `app/guards/auth-guard.ts`

**Funcionamiento**:
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const modalService = inject(ModalService);

  if (authService.autenticado()) return true;

  modalService.mostrarPedirAuth(state.url);
  return false;
};
```

**Comportamiento**:
- Si está autenticado --> Permite acceso
- Si no está autenticado --> Muestra modal y bloquea acceso
- Guarda la URL destino para redirección post-login

**Rutas protegidas**:
- `/dashboard` y todas sus hijas
- `/mi-grupo` y todas sus hijas
- `/perfil` y todas sus hijas

### salirAuthGuard (canDeactivate)

**Propósito**: Confirmar salida de páginas con cambios no guardados.

**Ubicación**: `app/guards/salir-auth-guard.ts`

**Funcionamiento**:
```typescript
export const salirAuthGuard: CanDeactivateFn<unknown> = (component: any) => {
  const modalService = inject(ModalService);

  if (typeof component.hayCambiosAuth === 'function') {
    const hay = component.hayCambiosAuth();
    if (!hay) return true;
    return modalService.confirmarSalir();
  }

  return true;
};
```

**Comportamiento**:
- Verifica si el componente tiene cambios mediante `hayCambiosAuth()`
- Si hay cambios → Muestra modal de confirmación
- Si no hay cambios → Permite navegación

**Rutas protegidas**:
- `/login`
- `/registro`

**Implementación en componente**:
```typescript
class LoginPage {
  hayCambiosAuth(): boolean {
    return this.formulario.dirty;
  }
}

```

## Metadatos de Rutas

### Title (Título del Navegador)

Cada ruta define su título mediante la propiedad `title`:

```typescript
{
  path: "dashboard",
  title: "Dashboard",
  // ...
}
```

**Resultado**: Se actualiza automáticamente `<title>Dashboard | Cohabit</title>`

### Breadcrumbs

Utilizados para navegación jerárquica:

```typescript
{
  path: "reservas",
  data: { breadcrumb: "Reservas" }
}
```

**Ejemplo de breadcrumb resultante**:
```
Inicio > Dashboard > Reservas
```

### Herencia de Configuración

Las rutas hijas heredan configuración del padre:

```typescript
{
  path: "dashboard",
  canActivate: [authGuard],  // ← Padre protegido
  children: [
    {
      path: "reservas",       // ← Hijo hereda protección
      // ...
    }
  ]
}
```


