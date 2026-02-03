# Frontend

Este directorio contiene la aplicación frontend desarrollada con Angular 20, se puede accecer al frontend en este [enlace](https://cohabit-front-xjlup.ondigitalocean.app/).

## Entregas

- [Documentación para DIW](./docs/design/DOCUMENTACION.md)
- [Documentación para DWEC](./docs/cliente)

## Tabla de contenidos

- [Estructura](#estructura)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Scripts disponibles](#scripts-disponibles)
- [Desarrollo local](#desarrollo-local)


## Estructura
```
frontend/
├── README.md                       # Documentación del frontend
├── angular.json                    # Configuración Angular CLI
├── Dockerfile                      # Imagen de producción
├── Dockerfile.dev                  # Imagen para desarrollo
├── nginx.conf                      # Configuración nginx usada en despliegue
├── package.json                    # Dependencias y scripts npm
├── proxy.conf.json                 # Proxy para desarrollo local (API)
├── tsconfig.app.json               # TS config para la app
├── tsconfig.json                   # TS raíz
├── tsconfig.spec.json              # TS para tests
├── .dockerignore                   # Archivos ignorados en la imagen Docker
├── .editorconfig                   # Reglas de formato editor
├── docs/                           # Documentación entregable
│   ├── accesibilidad/              # Guías de accesibilidad
│   │   └── README.md
│   └── cliente/                    # Documentación por entregas (Fases)
│       ├── Fase1.md
│       ├── Fase2.md
│       ├── Fase3.md
│       ├── Fase4.md
│       ├── Fase5.md
│       ├── Fase6.md
│       └── Fase7.md
├── public/                         # Archivos estáticos
│ 
└── src/                            # Código fuente de la aplicación
	├── feather-icons.d.ts          # Declaración del módulo feather-icons
	├── index.html                  # Entrada HTML
	├── main.ts                     # archivo main de Angular
	├── runtime-config.example.ts   # Ejemplo de configuración en tiempo de ejecución
	├── runtime-config.ts           # Configuración en tiempo de ejecución
	└── app/                        # Código principal de la aplicación
		├── app.config.ts           # Configuración de la app (DI, providers)
		├── app.html                # HTML principal de la app
		├── app.routes.ts           # Definición de rutas
		├── app.scss                # Estilos de la aplicación
		├── app.spec.ts             # Tests de integración del app shell
		├── app.ts                  # Entrypoint / componente raíz
		├── components/             # Componentes reutilizables
		│   ├── layout/ 			# Componentes layout
		│   ├── pages/ 				# Componentes que simulan una página
		|   └── shared/ 			# Componentes reutilizables
		├── core/                   # Módulo core
		│   └── interceptors/       # Interceptores HTTP: auth, error, logging
		├── directives/             # Directivas reutilizables
		├── form/ 					# servicios y validadores de los formularios
		├── guards/                 # Guards de rutas (auth, salir)
		├── models/                 # Modelos / DTOs TypeScript
		├── pages/                  # Páginas de la app
		├── pipes/                  # Pipes
		├── resolvers/              # Resolvers de rutas (precarga de datos)
		└── services/               # Servicios para llamadas a API y lógica
	└── styles/                     # Carpetas de estilo SCSS (estructura ITCSS)
		├── style.scss              # Archivo principal que importa el resto de partials
		├── 00-settings/            # Variables globales y configuración (Sass/CSS variables)
		│   ├── _css-variables.scss # Propiedades CSS custom (variables :root) usadas en runtime
		│   └── _variables.scss     # Variables Sass (colores, tamaños, etc.)
		├── 01-tools/               # Mixins, funciones y herramientas reutilizables
		│   └── _mixins.scss        # Mixins y helpers Sass (responsive, clearfix, etc.)
		├── 02-generic/             # Reglas globales y resets (box-sizing, tipografías base)
		│   └── _reset.scss         # Reset CSS y estilos base del proyecto
		├── 03-elements/            # Estilos a nivel de elementos HTML (buttons, inputs)
		│   └── _elements.scss      # Definiciones de estilos de elementos reutilizables
		└── 04-layout/              # Reglas de layout (grid, contenedores, regiones)
			└── _layout.scss        # Estilos de estructura y posicionamiento de la UI
```

## Requisitos

- Node.js (recomendado v18+)
- npm (6+)
- Angular CLI (opcional, se pueden usar los scripts npm definidos)

## Instalación

Instala dependencias y prepara el entorno:

```bash
cd frontend
npm install
```

## Scripts disponibles

Los scripts definidos en `package.json` son:

- `npm start` : Inicia el servidor de desarrollo (`ng serve`).
- `npm run build` : Compila la aplicación y genera la salida en `dist/`.
- `npm run watch` : Compila en modo watch (útil en desarrollo).
- `npm test` : Ejecuta tests unitarios (Karma/Jasmine).
- `npm run test-ci` : Ejecuta tests en modo CI (sin watch, con `ChromeHeadless`).

## Desarrollo local

Para desarrollo local con proxy hacia el backend:

```bash
cd frontend
# Levanta dev server y aplica el proxy definido en proxy.conf.json
npm start -- --proxy-config proxy.conf.json
```

Abre `http://localhost:4200` en el navegador. Los cambios en `src/` se recargarán automáticamente.

### Configuración del backend en tiempo de ejecución

La URL base del backend se lee desde `src/runtime-config.ts` (exporta `RUNTIME_CONFIG.apiBaseUrl`).

### Build y despliegue

Genera los artefactos para producción:

```bash
npm run build -- --configuration production
```

Si quieres crear la imagen Docker (se incluye `Dockerfile` y `nginx.conf`):

```bash
# Desde la carpeta frontend
docker build -t cohabit-frontend:latest .
```

### Tests

Ejecuta tests unitarios:

```bash
npm test
```

En CI se puede usar:

```bash
npm run test-ci
```
