# Fase 2 - Arquitectura de servicios

## Arquitectura de servicios

Este proyecto Angular implementa una arquitectura de servicios basada en componentes standalone con inyección de dependencias moderna usando la función `inject()`. La arquitectura está diseñada para mantener una clara separación de responsabilidades entre la lógica de presentación y la lógica de negocio.

### Diagrama de arquitectura de servicios

```
src/app/
 ├─ components/
 │   ├─ shared/
 │   │   ├─ login-form/          └─ LoginForm (consume: FormBuilder, AuthService)
 │   │   ├─ registro-form/       └─ RegistroForm (consume: FormBuilder, ValidadoresAsincronosService)
 │   │   ├─ form-input/          └─ FormInput (presentacional)
 │   │   ├─ form-select/         └─ FormSelect (presentacional)
 │   │   ├─ form-textarea/       └─ FormTextarea (presentacional)
 │   │   ├─ form-checkbox/       └─ FormCheckbox (presentacional, emite checkedChange)
 │   │   ├─ button/              └─ Button (presentacional)
 │   │   ├─ card/                └─ Card (emite editar, eliminar)
 │   │   ├─ modal/               └─ Modal (emite cierre)
 │   │   ├─ modal-reserva/       └─ ModalReserva (emite guardar, cerrar)
 │   │   ├─ tooltip/             └─ Tooltip (mouseenter/focusin)
 │   │   ├─ tab/                 └─ Tab (keydown navigation)
 │   │   ├─ accordion/           └─ Accordion / AccordionItem (emite itemToggled)
 │   │   └─ notificacion/        └─ Notificacion (gestiona notificaciones)
 │   └─ layout/
 │       ├─ header/              └─ Header (gestión tema, menu, @HostListener escape)
 │       ├─ footer/              └─ Footer
 │       └─ sidebar/             └─ Sidebar (navegación)
 │
 ├─ pages/
 │   ├─ inicio/                 └─ Inicio (página pública)
 │   ├─ login/                  └─ Login (form + ngSubmit)
 │   ├─ registro/               └─ Registro
 │   ├─ dashboard/              └─ Dashboard (lazy-loaded children)
 │   ├─ mi-grupo/               └─ MiGrupo (lazy-loaded children)
 │   └─ ... (recursos, reservas, perfil, etc.)
 │
 ├─ services/
 │   ├─ api.service.ts          └─ ApiService (HTTP wrapper, providedIn: 'root')
 │   ├─ auth.service.ts         └─ AuthService (login/logout, providedIn: 'root')
 │   ├─ grupo.service.ts        └─ GrupoService (providedIn: 'root')
 │   ├─ miembro-grupo.service.ts└─ MiembroGrupoService (providedIn: 'root')
 │   ├─ recurso.service.ts      └─ RecursoService (providedIn: 'root')
 │   ├─ reserva.service.ts      └─ ReservaService (providedIn: 'root')
 │   ├─ regla-recurso.service.ts└─ ReglaRecursoService (providedIn: 'root')
 │   ├─ notificacion.service.ts └─ NotificacionService (providedIn: 'root')
 │   ├─ modal.service.ts        └─ ModalService (gestiona apertura/cierre de modales)
 │   ├─ breadcrumb.service.ts   └─ BreadcrumbService
 │   ├─ redireccion.service.ts  └─ RedireccionService
 │   ├─ theme-switcher.service.ts└─ ThemeSwitcherService (gestión tema)
 │   └─ usuario.service.ts      └─ UsuarioService
 │
 ├─ form/
 │   ├─ services/
 │   │   └─ ValidadoresAsincronosService (providedIn: 'root')
 │   └─ validators/
 │       ├─ validarEmailConTLD()
 │       ├─ validarFortalezaContrasenia()
 │       └─ validarContraseniaCoincidente()
 │
 ├─ directives/
 │   └─ feather-icon.directive.ts └─ FeatherIconDirective
 │
 └─ app.config.ts (configuración de providers)

Infraestructura y APIs externas:
 ├─ Angular Core (inyectables): FormBuilder, Router, Renderer2, ElementRef, HttpClient
 ├─ Browser APIs: localStorage (persistencia de tema), window.matchMedia (preferencias sistema)
 └─ Observables (RxJS) para flujos asíncronos y validadores
```

#### Flujo de datos y responsabilidades

**Capa de Presentación (Componentes):**
Los componentes de UI (`Button`, `FormInput`, `FormCheckbox`, `Alert`, `Card`) son puramente presentacionales y no contienen lógica de negocio. Se comunican mediante `@Input()` y `@Output()` con sus componentes padre.

**Capa de Lógica de Negocio (Componentes Inteligentes):**
Los componentes de formularios (`LoginForm`, `RegistroForm`) actúan como controladores que:
- Inyectan servicios necesarios mediante `inject()`
- Configuran formularios reactivos usando `FormBuilder`
- Delegan validaciones a servicios y funciones validadoras
- Gestionan el estado del formulario y la lógica de presentación

**Capa de Servicios:**
- **`ValidadoresAsincronosService`**: Servicio singleton (`providedIn: 'root'`) que proporciona validadores asíncronos simulando llamadas a backend. Retorna Observables para integración con formularios reactivos.
- **Validadores funcionales**: Funciones puras que implementan lógica de validación específica (email con TLD, fortaleza de contraseña, coincidencia de contraseñas).

**Capa de Infraestructura:**
- **Angular Core Services**: `FormBuilder`, `Router`, `Renderer2` son proporcionados por Angular.
- **Browser APIs**: Acceso directo a `localStorage` y `matchMedia` para funcionalidades del navegador.

### Patrones de comunicación implementados

#### 1. Inyección de dependencias (Dependency Injection)

Angular utiliza un sistema de inyección de dependencias que permite desacoplar componentes y servicios. En este proyecto se usa la función moderna `inject()` en lugar del constructor tradicional.

#### 2. Observables y streams reactivos (RxJS)

Se utilizan Observables para manejar operaciones asíncronas, especialmente en validaciones de formulario.


#### 3. Validación reactiva (Reactive Forms)

Patrón que combina formularios reactivos de Angular con validadores síncronos y asíncronos.


#### 4. Funciones validadoras puras

Las validaciones síncronas se implementan como funciones puras que retornan `ValidatorFn`.

#### 5. Request-response

Aunque actualmente el proyecto no tiene conexión con backend real, el patrón está preparado para ello.
### Buenas prácticas de separación de responsabilidades

#### Definición de responsabilidades por capa

##### 1. Componentes de presentación (UI)
##### 2. Componentes Inteligentes (Smart Components)
##### 3. Servicios de Dominio
##### 4. Validadores Funcionales (Lógica de Dominio Pura)
##### 5. Servicios de Infraestructura


#### Reglas específicas del proyecto

- Los componentes no realizan llamadas HTTP directamente.
- Los servicios de dominio no conocen detalles de UI.
- No duplicar código.
- Componentes de presentación solo manejan la UI.

