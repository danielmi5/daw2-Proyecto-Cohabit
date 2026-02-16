# Proyecto Cohabit

Proyecto Cohabit es una aplicación web para gestionar recursos compartidos en viviendas y espacios colectivos. Permite a los residentes reservar recursos (cocina, lavadora, salón, etc.), ver calendarios de uso y administrar usuarios para mejorar la convivencia.

Para poder ver la aplicación puedes acceder a este enlace [https://cohabit-front-xjlup.ondigitalocean.app/](https://cohabit-front-xjlup.ondigitalocean.app/).

## Tabla de contenidos

- [Estructura](#estructura)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Despliegue](#despliegue)
- [Proyecto 4 - Accesibilidad y Multimedia](#proyecto-4---accesibilidad-y-multimedia)

## Estructura

Estructura principal del repositorio:

- [Backend](./backend)
- [Frontend](./frontend)

```
daw2-Proyecto-Cohabit/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── README.md
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/cohabit/cohabit_backend/
│   │   │   └── resources/
│   │   └── test/
│   └── target/
└── frontend/
	├── angular.json
	├── package.json
	├── README.md
	├── src/
	│   ├── app/
	│   └── styles/
	└── public/
```

## Características

- **Gestión de Grupos de Convivencia:** Creación de grupos, generación de códigos de invitación únicos y gestión de miembros con roles (Creador, Admin, Miembro).
- **Recursos y Reglas Personalizadas:** CRUD de recursos con reglas de uso específicas (horarios de apertura, duración máxima, capacidad).
- **Sistema de Reservas:** Validación de conflictos de horario, control de aforo y estados de reserva (Pendiente, Confirmada, Cancelada).
- **Seguridad y Usuarios:** Autenticación segura mediante JWT, gestión de perfiles y control de acceso basado en roles.
- **Interfaz Moderna (UI/UX):** Diseño responsive, modo claro/oscuro persistente, notificaciones visuales (Toasts) y modales interactivos.
- **Búsqueda Avanzada:** Filtrado dinámico de recursos y reservas por múltiples criterios.

## Tecnologías

- **Backend:** Java 21, Spring Boot 3 (Web, Data JPA, Security, Validation), JWT (jjwt), OpenAPI/Swagger (Documentación).
- **Base de datos:** PostgreSQL (Producción/Dev).
- **Frontend:** Angular 20 (Standalone Components, Signals, RxJS), TypeScript, SCSS (Arquitectura ITCSS).
- **Infraestructura:** Docker, Docker Compose, Nginx (Servidor web y Proxy inverso), GitHub Actions (CI/CD).

## Requisitos

- Java 21
- Maven
- Node.js (v18+) y npm
- Docker y docker-compose (opcional pero recomendado)

## Instalación y ejecución

### Configuración url backend
 
La configuración de la URL base del backend para el frontend ahora se gestiona mediante `src/runtime-config.ts` en el proyecto `frontend`.

### Con Docker (Recomendado)

#### Modo Producción

1. Clona el repositorio:

```bash
git clone <repo-url>
cd daw2-Proyecto-Cohabit
```

2. Levantar todos los servicios con Docker Compose:

```bash
docker-compose up --build
```

Esto levantará:
- PostgreSQL en `localhost:5432`
- Backend en `http://localhost:8080`
- Frontend (nginx) en `http://localhost:4200`

#### Modo Desarrollo (con hot-reload)

Para desarrollo con recarga automática del frontend:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Esto permite editar archivos del frontend y ver cambios en tiempo real.

### Sin Docker

#### Backend

```bash
cd backend
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`.

#### Frontend

```bash
cd frontend
npm install
npm start
```

El frontend estará disponible en `http://localhost:4200`.

## Despliegue

### Docker Compose

El proyecto incluye dos archivos de configuración:

- **`docker-compose.yml`** (Producción): Construye el frontend optimizado con nginx
- **`docker-compose.dev.yml`** (Desarrollo): Usa servidor de desarrollo con hot-reload

#### Producción

```bash
docker-compose up --build
```

- **Base de datos:** PostgreSQL en Render
- **Backend:** API REST en `https://cohabit-backend-n6k7o.ondigitalocean.app`
- **Frontend:** Aplicación Angular servida con nginx en `http://localhost:4200`

#### Desarrollo

```bash
docker-compose -f docker-compose.dev.yml up --build
```
- **Base de datos:** PostgreSQL en `localhost:5432`
- **Backend:** API REST en `http://localhost:8080`
- **Frontend:** Aplicación Angular servida con nginx en `http://localhost:4200`

Incluye montaje de volúmenes para hot-reload del frontend.

### Detener servicios

```bash
docker-compose down
```

Para eliminar también los volúmenes:

```bash
docker-compose down -v
```

---

## Proyecto 4 - Accesibilidad y Multimedia

### Descripción

Implementación de mejoras de accesibilidad WCAG 2.1 AA en el proyecto Cohabit, con especial atención a la navegación por teclado, compatibilidad con lectores de pantalla y estructura semántica. Se añadió un carrusel accesible de recursos como componente multimedia para el dashboard.

### Componente multimedia añadido

Es un carrusel de recursos con navegación por teclado (flechas), indicador de posición visual (ej: "2/3") y anuncios aria-live para lectores de pantalla.

### Resultados de auditoría de accesibilidad

| Herramienta | Puntuación inicial | Puntuación final | Mejora |
|-------------|-------------------|------------------|--------|
| Lighthouse | 88/100 | 100/100 | +12 |
| WAVE | 0 errores | 0 errores | Nada |
| TAW | 1 problema | 0 problemas | -1 problema |

**Nivel de conformidad alcanzado:** WCAG 2.1 AA

### Documentación completa

📄 **[Ver análisis completo de accesibilidad](./frontend/docs/accesibilidad/README.md)**

### Verificación realizada

- ✅ Auditoría con Lighthouse, WAVE y TAW
- ✅ Test con lector de pantalla (NVDA)
- ✅ Test de navegación por teclado
- ✅ Verificación cross-browser (Chrome, Firefox, Edge)

### Tecnologías utilizadas

- HTML5 semántico (landmarks, roles ARIA)
- Angular 20 (Standalone Components, Signals)
- SCSS con arquitectura ITCSS
- TypeScript con Change Detection OnPush
- WCAG 2.1 (criterios AA)

### Instalación y uso

```bash
git clone https://github.com/danielmi5/daw2-Proyecto-Cohabit.git
cd daw2-Proyecto-Cohabit
docker-compose up --build
```

El proyecto en local estará disponible en `http://localhost:4200`

### Autor

**Nombre:** Daniel  
**Curso:** 2º DAW - Desarrollo de Aplicaciones Web  
**Módulo:** Diseño de Interfaces Web (DIW)

---

Para más detalles:
- Backend: [backend/README.md](./backend/README.md)
- Frontend: [frontend/README.md](./frontend/README.md)

