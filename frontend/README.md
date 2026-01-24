# Frontend

Este directorio contiene la aplicación frontend desarrollada con Angular 20, se puede accecer al frontend en este [enlace](https://danielmi5.github.io/daw2-Proyecto-Cohabit/).

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
├── .editorconfig
├── .gitignore
├── angular.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
├── .angular/
│   └── cache/
├── docs/
│   ├── cliente/
│   │   ├── Fase1.md
│   │   ├── Fase2.md
│   │   └── Fase3.md
│   └── design/
│       ├── DOCUMENTACION.md
│       └── img/
├── public/
│   ├── footer/
│   ├── header/
│   └── img/
├── src/
│   ├── feather-icons.d.ts
│   ├── index.html
│   ├── main.ts
│   ├── app/
│   │   ├── app.config.ts
│   │   ├── app.html
│   │   ├── app.routes.ts
│   │   ├── app.scss
│   │   ├── app.spec.ts
│   │   ├── app.ts
	│   ├── components/           # directorio con componentes
	│   ├── directives/
	│   │   └── feather-icon.directive.ts
	│   ├── form/ # servicios y validadores de los formularios
	│   │   ├── services/ 
	│   │   │   └── validadores-asincronos.service.ts
	│   │   └── validators/
	│   │       ├── email-tld.validator.ts
	│   │       ├── index.ts
	│   │       ├── password-match.validator.ts
	│   │       └── password-strength.validator.ts
	│   ├── pages/                # directorio con páginas
	│   
│   └── styles/ # Estilos definidos
│       ├── style.scss
│       ├── 00-settings/
│       │   ├── _css-variables.scss
│       │   └── _variables.scss
│       ├── 01-tools/
│       │   └── _mixins.scss
│       ├── 02-generic/
│       │   └── _reset.scss
│       ├── 03-elements/
│       │   └── _elements.scss
│       └── 04-layout/
		 │       └── _layout.scss
```

## Requisitos

- Node.js (recomendado v18+)
- npm
- Angular CLI (opcional, se pueden usar los scripts ya definidos)

## Instalación

```bash
cd frontend
npm install
```

## Scripts disponibles

- `npm start` : Inicia el servidor de desarrollo (`ng serve`).
- `npm run build` : Compila el proyecto y genera artefactos en `dist/`.
- `npm run watch` : Compila en modo watch (desarrollo).
- `npm test` : Ejecuta tests unitarios (Karma/Jasmine).
- `npm run test-ci` : Ejecuta tests en modo CI (sin watch, con ChromeHeadless).

## Desarrollo local

Para desarrollar localmente:

```bash
npm start
```

Abre `http://localhost:4200` en tu navegador. Los cambios en `src/` se recargarán automáticamente.

### Configuración entorno backend

La URL base del backend se lee desde `src/runtime-config.ts` (exporta `RUNTIME_CONFIG.apiBaseUrl`). 
