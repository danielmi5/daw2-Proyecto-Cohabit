# Backend (Springboot + PostgreSQL)

API REST del proyecto Cohabit, implementada con Spring Boot y PostgreSQL.

## Requisitos

- Java 17+
- Maven
- PostgreSQL (configurable en `src/main/resources/application.properties`)
- Docker

## Como ejecutar

1. Configurar (si es necesario) variables de configuración en `src/main/resources/application.properties` o en las variables de entorno usadas por Docker Compose.
2. Levantar los servicios con Docker Compose (desde la raíz del proyecto):

```bash
docker compose up --build -d
```

## Estructura

En la carpeta `backend` la organización principal sigue la convención típica de un proyecto Spring Boot. A continuación se describen las carpetas más relevantes y su propósito.

### Entity

La carpeta `src/main/java/com/cohabit/cohabit_backend/entity` contiene las clases que representan el modelo de dominio y se mapean a las tablas de la base de datos mediante JPA. Aquí se definen atributos, relaciones y reglas de persistencia (anotaciones JPA, mapeos, callbacks como `@PrePersist`/`@PreUpdate`).

#### Usuario

La entidad `Usuario` representa a una persona registrada en la aplicación. Incluye campos como `id`, `nombre`, `apellidos`, `email` (único), `password`, `fotoPerfil`, `pais`, `ciudad`, `telefono` y `fechaRegistro`. Además mantiene una relación 1:1 con `MiembroGrupo` cuando el usuario se asocia a un grupo, y contiene lógica de inicialización de `fechaRegistro` con `@PrePersist`.

#### Grupo

La entidad `Grupo` modela una unidad de convivencia o comunidad. Contiene información descriptiva (`nombre`, `direccion`, `descripcion`, `fotoGrupo`) y metadatos (`codigoInvitacion`, `fechaCreacion`, `fechaActualizacion`). Un `Grupo` tiene muchos `MiembroGrupo` y muchos `Recurso`. Además referencia al `Usuario` creador.

#### MiembroGrupo

`MiembroGrupo` representa la pertenencia de un `Usuario` a un `Grupo`. Define el `rol` del miembro (ej. `CREADOR`), la `fechaUnion`, si está `activo` y mantiene colecciones de `Reserva` y recursos creados por ese miembro.

#### Recurso

`Recurso` es un elemento que puede reservarse (p. ej. habitación, electrodoméstico, vehículo). Tiene atributos como `capacidad`, `ubicacion`, `tipo` y `estadoActual`. Pertenece a un `Grupo`, puede tener un `MiembroGrupo` creador, y contiene `ReglaRecurso` y `Reserva` asociadas.

#### Reserva

`Reserva` guarda solicitudes de uso de un `Recurso`: `fecha`, `horaInicio`, `horaFin`, `notas`, `numPersonas` y `estado`. Está asociada a un `MiembroGrupo` (quien reserva) y a un `Recurso`.

#### ReglaRecurso

`ReglaRecurso` contiene restricciones o configuraciones aplicables a un `Recurso` (por ejemplo, horario permitido, aforo máximo). Incluye `tipoRegla`, `valor` y `descripcion`.

### DTO

La carpeta `src/main/java/com/cohabit/cohabit_backend/dto` contiene los objetos usados para la comunicación entre capa de servicio/controlador y el exterior (requests/responses). Esto evita exponer la estructura interna y facilita validaciones.

#### Ejemplos de DTOs relevantes
- `UsuarioRequestDTO` / `UsuarioResponseDTO`: entidad Usuario.
- `GrupoRequestDTO` / `GrupoResponseDTO`. entidad Grupo.
- `MiembroGrupoRequestDTO` / `MiembroGrupoResponseDTO`. entidad MiembroGrupo.
- `RecursoRequestDTO` / `RecursoResponseDTO`: entidad Recurso.
- `ReservaRequestDTO` / `ReservaResponseDTO`. entidad Reserva.
- `ReglaRecursoRequestDTO` / `ReglaRecursoResponseDTO` entidad ReglaRecurso.
- `ApiErrorDTO`

### Mapper

Los mappers convierten entre entidades y DTOs. Están en `src/main/java/com/cohabit/cohabit_backend/mapper` y centralizan la transformación, evitando lógica de mapeo duplicada en servicios.

### Repository

Los repositorios JPA están en `src/main/java/com/cohabit/cohabit_backend/repository` y extienden `JpaRepository`. Proveen consultas básicas y métodos personalizados para acceder a la base de datos.

- `UsuarioRepository`, `GrupoRepository`, `RecursoRepository`, `MiembroGrupoRepository`, `ReservaRepository`, `ReglaRecursoRepository`.

### Service

La capa de servicio (paquete `service`) implementa la lógica de negocio: validaciones, transacciones y orquestación entre repositorios y mappers. Cada servicio expone métodos CRUD y operadores de negocio específicos. Servicios utilizados:

- `UsuarioService`: CRUD usuarios y validaciones.
- `GrupoService`: creación con generación de `codigoInvitacion`, gestión de miembros.
- `MiembroGrupoService`: gestión de roles y acciones del usuario en el grupo.
- `RecursoService`: CRUD recursos y validaciones.
- `ReglaRecursoService`: CRUD reglas y validaciones.
- `ReservaController`: Crud reservas y validaciones

### Controller

Los controladores exponen la API REST y traducen DTOs a llamadas a servicios. Se encargan de paginación, ordenación, filtrado, validación básica (`@Valid`) y de devolver códigos HTTP adecuados.

#### Controladores y responsabilidades
- `UsuarioController` (`/api/usuarios`): rutas para CRUD de usuarios.
- `GrupoController` (`/api/grupos`): CRUD de grupos y creación de código de invitación.
- `MiembroGrupoController` (`/api/miembros`): gestionar miembros del grupo.
- `RecursoController` (`/api/recursos`): CRUD recursos.
- `ReglaRecursoController` (`/api/reglas`): CRUD reglas.
- `ReservaController` (`/api/reservas`): CRUD reservas.

**Requisitos**
- Java 17+
- Maven
- PostgreSQL (configurable en `src/main/resources/application.properties`)

**Cómo ejecutar (resumen)**
1. Configurar la base de datos en `src/main/resources/application.properties`.
2. Construir con `mvn clean package`.
3. Ejecutar el JAR o usar Docker/Docker Compose según el repositorio raíz.


## Modelo de Datos

Diagrama E/R:

![Diagrama E/R](./img/diagramaER.svg)

Relaciones entre tablas (formato: EntidadIzq (min,max)  .....  relación  .....  (min,max) EntidadDer):

- MiembroGrupo (1,1)  .....  1:1  .....  (1,1) Usuario

- MiembroGrupo (1,N)  .....  N:1  .....  (1,1) Grupo

- Recurso (1,N)  .....  N:1  .....  (1,1) Grupo

- Recurso (1,N)  .....  N:1  .....  (0,1) MiembroGrupo (creador opcional)

- Reserva (1,N)  .....  N:1  .....  (1,1) MiembroGrupo

- Reserva (1,N)  .....  N:1  .....  (1,1) Recurso

- ReglaRecurso (1,N)  .....  N:1  .....  (1,1) Recurso

- Grupo (1,1)  .....  1:1  .....  (1,1) Usuario (creador)

Estas son las entidades principales de la API

Descripción de las cardinalidades:

- Para cada `Usuario` hay como mínimo 1 `MiembroGrupo` y como máximo 1 `MiembroGrupo` (relación 1:1). Para cada `MiembroGrupo` hay exactamente 1 `Usuario`.
- Para cada `Grupo` hay como mínimo 1 `MiembroGrupo` y como máximo varios (`N`) `MiembroGrupo` (un grupo tiene uno o varios miembros). Para cada `MiembroGrupo` existe exactamente 1 `Grupo`.
- Un `Grupo` puede tener uno o varios `Recurso` (mínimo 1, máximo N); cada `Recurso` pertenece a exactamente 1 `Grupo`.
- Un `MiembroGrupo` puede crear cero o varios `Recurso`; un `Recurso` puede haber sido creado por 0 o 1 `MiembroGrupo` (creador opcional).
- Un `MiembroGrupo` puede realizar cero o varias `Reserva`; cada `Reserva` pertenece a exactamente 1 `MiembroGrupo`.
- Un `Recurso` puede tener cero o varias `Reserva`; cada `Reserva` pertenece a exactamente 1 `Recurso`.
- Un `Recurso` puede tener cero o varias `ReglaRecurso`; cada `ReglaRecurso` pertenece a exactamente 1 `Recurso`.
- Cada `Grupo` tiene exactamente 1 `Usuario` creador, cada `Usuario` es creador de exactamente 1 `Grupo`.

### Usuario

| Campo | Tipo (Java) | PK / FK | Validaciones / restricciones | Descripción |
|---|---:|:---:|---|---|
| id | Long | PK | @Id, @GeneratedValue | Identificador único del usuario |
| nombre | String |  | @Column(nullable=false) | Nombre propio |
| apellidos | String |  | @Column(nullable=false) | Apellidos |
| email | String |  | @Column(nullable=false, unique=true) | Correo electrónico (único) |
| password | String |  | @Column(nullable=false) | Contraseña (hash en aplicación) |
| fotoPerfil | String |  |  | URL o referencia a foto de perfil |
| pais | String |  |  | País del usuario |
| ciudad | String |  |  | Ciudad del usuario |
| telefono | String |  |  | Teléfono de contacto |
| fechaRegistro | LocalDateTime |  | @Column(nullable=false), @PrePersist | Fecha de registro |

Relaciones:
- `Usuario` tiene una relación 1:1 bidireccional con `MiembroGrupo` (mapeada por `MiembroGrupo.usuario`). El FK real está en `miembros_grupo.usuario_id`.

### Grupo

| Campo | Tipo (Java) | PK / FK | Validaciones / restricciones | Descripción |
|---|---:|:---:|---|---|
| id | Long | PK | @Id, @GeneratedValue | Identificador único del grupo |
| nombre | String |  | @Column(nullable=false) | Nombre del grupo |
| direccion | String |  |  | Dirección del domicilio o local |
| descripcion | String |  | @Column(length=1000) | Descripción del grupo |
| fotoGrupo | String |  |  | URL o referencia a imagen del grupo |
| codigoInvitacion | String |  | @Column(nullable=false, unique=true) | Código de invitación generado |
| fechaCreacion | LocalDateTime |  | @Column(nullable=false), @PrePersist | Fecha de creación |
| fechaActualizacion | LocalDateTime |  | @Column(nullable=false), @PreUpdate | Fecha de última actualización |
| creador_id | Long | FK -> Usuario | @OneToOne(fetch=LAZY), @JoinColumn(nullable=false, unique=true) | Referencia al `Usuario` creador (único) |

Relaciones:
- `Grupo` 1:N `MiembroGrupo` (miembros)
- `Grupo` 1:N `Recurso` (recursos pertenecientes al grupo)
- `Grupo` 1:1 `Usuario` (creador) — FK en `grupos.creador_id`.

### MiembroGrupo

| Campo | Tipo (Java) | PK / FK | Validaciones / restricciones | Descripción |
|---|---:|:---:|---|---|
| id | Long | PK | @Id, @GeneratedValue | Identificador del miembro |
| usuario_id | Long | FK -> Usuario (único) | @OneToOne, @JoinColumn(nullable=false, unique=true) | Usuario asociado al miembro |
| grupo_id | Long | FK -> Grupo | @ManyToOne, @JoinColumn(nullable=false) | Grupo al que pertenece |
| rol | RolGrupo (enum) |  | @Enumerated(EnumType.STRING), @Column(nullable=false) | Rol del miembro en el grupo |
| fechaUnion | LocalDateTime |  | @Column(nullable=false), @PrePersist | Fecha de unión al grupo |
| activo | boolean |  | @Column(nullable=false), default true | Indica si la membresía está activa |

Relaciones:
- `MiembroGrupo` N:1 `Grupo`
- `MiembroGrupo` 1:1 `Usuario` (propietario del registro)
- `MiembroGrupo` 1:N `Reserva` (reservas realizadas por el miembro)
- `MiembroGrupo` 1:N `Recurso` (recursos creados por este miembro)

### Recurso

| Campo | Tipo (Java) | PK / FK | Validaciones / restricciones | Descripción |
|---|---:|:---:|---|---|
| id | Long | PK | @Id, @GeneratedValue | Identificador del recurso |
| nombre | String |  | @Column(nullable=false) | Nombre del recurso |
| descripcion | String |  | @Column(length=1000) | Descripción detallada |
| fotoRecurso | String |  |  | URL o referencia a imagen |
| capacidad | Integer |  |  | Capacidad o aforo (>=1 si indicado) |
| ubicacion | String |  |  | Ubicación dentro del grupo |
| tipo | TipoRecurso (enum) |  | @Enumerated(EnumType.STRING), @Column(nullable=false) | Tipo de recurso |
| estadoActual | EstadoRecurso (enum) |  | @Enumerated(EnumType.STRING), @Column(nullable=false) | Estado actual del recurso |
| grupo_id | Long | FK -> Grupo | @ManyToOne, @JoinColumn(nullable=false) | Grupo propietario del recurso |
| creador_id | Long | FK -> MiembroGrupo | @ManyToOne, @JoinColumn(nullable=true) | Miembro que creó el recurso (opcional) |
| fechaCreacion | LocalDateTime |  | @Column(nullable=false), @PrePersist | Fecha creación |
| fechaActualizacion | LocalDateTime |  | @PreUpdate | Fecha última actualización |

Relaciones:
- `Recurso` N:1 `Grupo`
- `Recurso` N:1 `MiembroGrupo` (creador opcional)
- `Recurso` 1:N `Reserva`
- `Recurso` 1:N `ReglaRecurso`

### Reserva

| Campo | Tipo (Java) | PK / FK | Validaciones / restricciones | Descripción |
|---|---:|:---:|---|---|
| id | Long | PK | @Id, @GeneratedValue | Identificador de la reserva |
| fecha | LocalDate |  | @Column(nullable=false) | Fecha de la reserva |
| horaInicio | LocalTime |  | @Column(nullable=false) | Hora de inicio |
| horaFin | LocalTime |  | @Column(nullable=false) | Hora de fin |
| notas | String |  | @Column(length=1000) | Notas adicionales |
| numPersonas | Integer |  |  | Número de personas (si aplica) |
| estado | EstadoReserva (enum) |  | @Enumerated(EnumType.STRING), @Column(nullable=false) | Estado de la reserva |
| miembro_grupo_id | Long | FK -> MiembroGrupo | @ManyToOne, @JoinColumn(nullable=false) | Solicitante de la reserva |
| recurso_id | Long | FK -> Recurso | @ManyToOne, @JoinColumn(nullable=false) | Recurso reservado |
| fechaCreacion | LocalDateTime |  | @Column(nullable=false), @PrePersist | Fecha creación |
| fechaActualizacion | LocalDateTime |  | @PreUpdate | Fecha última actualización |

Relaciones:
- `Reserva` N:1 `MiembroGrupo` (quien reserva)
- `Reserva` N:1 `Recurso` (recurso reservado)

### ReglaRecurso

| Campo | Tipo (Java) | PK / FK | Validaciones / restricciones | Descripción |
|---|---:|:---:|---|---|
| id | Long | PK | @Id, @GeneratedValue | Identificador de la regla |
| tipoRegla | TipoRegla (enum) |  | @Enumerated(EnumType.STRING), @Column(nullable=false) | Tipo de regla (ej. HORARIO, AFORO) |
| valor | String |  | @Column(nullable=false) | Valor de la regla (p. ej. "08:00-20:00" o "6") |
| descripcion | String |  | @Column(length=1000) | Descripción de la regla |
| recurso_id | Long | FK -> Recurso | @ManyToOne, @JoinColumn(nullable=false) | Recurso al que aplica |
| fechaCreacion | LocalDateTime |  | @Column(nullable=false), @PrePersist | Fecha creación |
| fechaActualizacion | LocalDateTime |  | @PreUpdate | Fecha última actualización |

Relaciones:
- `ReglaRecurso` N:1 `Recurso` (cada regla está asociada a un recurso concreto)


