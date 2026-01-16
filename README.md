# Proyecto Cohabit

Proyecto Cohabit es una aplicación web para gestionar recursos compartidos en viviendas y espacios colectivos. Permite a los residentes reservar recursos (cocina, lavadora, salón, etc.), ver calendarios de uso y administrar usuarios para mejorar la convivencia.

Para poder ver la aplicación actualmente, recomiendo levantarla mediante docker. Más info de como desplegarla en la sección "despliegue".

## Tabla de contenidos

- [Estructura](#estructura)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Despliegue](#despliegue)

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

- Reservas de recursos con ventanas de tiempo.
- Gestión de usuarios, autenticación y roles básicos.
- API REST para CRUD de recursos y reservas.
- Interfaz web responsiva desarrollada con Angular.

## Tecnologías

- Backend: Java 21, Spring Boot (Web, Data JPA, Security)
- Base de datos: PostgreSQL
- Frontend: Angular 20
- Contenedores: Docker, docker-compose

## Requisitos

- Java 21
- Maven
- Node.js (recomendado v18+) y npm
- Docker y docker-compose (opcional pero recomendado)

## Instalación y ejecución

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

- **Base de datos:** PostgreSQL en `localhost:5432`
- **Backend:** API REST en `http://localhost:8080`
- **Frontend:** Aplicación Angular servida con nginx en `http://localhost:4200`

#### Desarrollo

```bash
docker-compose -f docker-compose.dev.yml up --build
```

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

Para más detalles:
- Backend: [backend/README.md](./backend/README.md)
- Frontend: [frontend/README.md](./frontend/README.md)

