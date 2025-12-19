# Proyecto Cohabit

Proyecto Cohabit es una aplicación web para gestionar recursos compartidos en viviendas y espacios colectivos. Permite a los residentes reservar recursos (cocina, lavadora, salón, etc.), ver calendarios de uso y administrar usuarios para mejorar la convivencia.

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

1. Clona el repositorio:

```bash
git clone <repo-url>
cd daw2-Proyecto-Cohabit
```

2. Levantar servicios con Docker Compose (recomendado):

```bash
docker-compose up --build
```

Esto levantará PostgreSQL y el backend. El backend quedará expuesto en `http://localhost:8080`.

3. Ejecutar el frontend en desarrollo (en otra terminal):

```bash
cd frontend
npm install
npm start
```

El frontend normalmente estará disponible en `http://localhost:4200`.

Si prefieres ejecutar el backend localmente sin Docker:

```bash
cd backend
mvn spring-boot:run
```

## Despliegue

El archivo `docker-compose.yml` en la raíz incluye los servicios `db` (Postgres) y `backend`.

Para el frontend puedes acceder a él desplegandolo localmente (más info en el README del frontend) o accediendo al [enlace](https://danielmi5.github.io/daw2-Proyecto-Cohabit/)

