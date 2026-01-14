# Fase 5: Servicios y comunicación HTTP

## Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura de Servicios](#arquitectura-de-servicios)
3. [Catálogo de Endpoints](#catálogo-de-endpoints)
4. [Interfaces TypeScript](#interfaces-typescript)


## Descripción General

Esta fase implementa la capa de servicios HTTP del frontend Angular, que se encarga de toda la comunicación con el backend Spring Boot. La arquitectura está diseñada para ser:

- **Modular**: Cada entidad tiene su propio servicio dedicado
- **Reutilizable**: Servicio base `ApiService` centraliza lógica común
- **Tipada**: Todas las peticiones y respuestas están fuertemente tipadas con TypeScript
- **Resiliente**: Manejo centralizado de errores y reintentos automáticos
- **Segura**: Interceptores para autenticación JWT automática

### Características Principales

- Servicios CRUD completos para todas las entidades
- Interceptor de autenticación JWT automático
- Manejo de errores centralizado y clasificado por tipo
- Paginación compatible con Spring Data Page
- Reintentos automáticos en peticiones GET
- Tipado estricto con interfaces TypeScript

## Arquitectura de Servicios

```
frontend/src/app/
├── services/
│   ├── api.service.ts              # Servicio base HTTP
│   ├── auth.service.ts             # Autenticación (login, register, logout)
│   ├── usuario.service.ts          # CRUD Usuarios
│   ├── grupo.service.ts            # CRUD Grupos
│   ├── recurso.service.ts          # CRUD Recursos
│   ├── reserva.service.ts          # CRUD Reservas
│   ├── miembro-grupo.service.ts    # CRUD Miembros de Grupo
│   ├── regla-recurso.service.ts    # CRUD Reglas de Recursos
│   └── error-handler.util.ts       # Utilidad de manejo de errores
│
├── core/
│   └── interceptors/
│       └── auth.interceptor.ts     # Interceptor JWT
│
└── models/
    ├── auth.models.ts              # Interfaces de autenticación
    ├── backend-types.ts            # Tipos del backend
    ├── api-list-response.model.ts  # Respuesta de listas
    ├── usuario.model.ts            # Interfaces de Usuario
    ├── grupo.model.ts              # Interfaces de Grupo
    ├── recurso.model.ts            # Interfaces de Recurso
    ├── reserva.model.ts            # Interfaces de Reserva
    ├── miembro-grupo.model.ts      # Interfaces de MiembroGrupo
    └── regla-recurso.model.ts      # Interfaces de ReglaRecurso
```

### Servicio Base: ApiService

El `ApiService` centraliza toda la lógica de peticiones HTTP y proporciona métodos genéricos reutilizables:

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:4200';

  // Métodos genéricos con manejo de errores integrado
  get<T>(endpoint: string, options?): Observable<T>
  post<T>(endpoint: string, body: unknown, options?): Observable<T>
  put<T>(endpoint: string, body: unknown, options?): Observable<T>
  delete<T>(endpoint: string, options?): Observable<T>
}
```

**Características**:
- URL base centralizada
- Manejo automático de errores con `catchError`
- Soporte para parámetros HTTP y headers personalizados
- Tipado genérico para respuestas

## Catálogo de Endpoints

### Autenticación (`auth.service.ts`)

| Método | Endpoint | Descripción | Request Body | Response | Observaciones |
|--------|----------|-------------|--------------|----------|---------------|
| POST | `/auth/login` | Iniciar sesión | `LoginRequest` | `AuthResponse` | Devuelve token JWT |
| POST | `/auth/register` | Registrar usuario | `RegisterRequest` | `AuthResponse` | Crea usuario y devuelve token |

**URL Base**: `http://localhost:8080/auth`

**Interfaces**:
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}
```

### Usuarios (`usuario.service.ts`)

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|----------|
| GET | `/api/usuarios/{id}` | Obtener usuario por ID | `id: number` | `UsuarioResponse` |
| GET | `/api/usuarios` | Listar usuarios paginados | `page, size` (query) | `ApiListResponse<UsuarioResponse>` |
| POST | `/api/usuarios` | Crear usuario | `UsuarioRequest` (body) | `UsuarioResponse` |
| PUT | `/api/usuarios/{id}` | Actualizar usuario | `id: number`, `UsuarioUpdate` (body) | `UsuarioResponse` |
| DELETE | `/api/usuarios/{id}` | Eliminar usuario | `id: number` | `void` |

**URL Base**: `/api/usuarios` (relativa a `baseUrl`)

### Grupos (`grupo.service.ts`)

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|----------|
| GET | `/api/grupos/{id}` | Obtener grupo por ID | `id: number` | `GrupoResponse` |
| GET | `/api/grupos` | Listar grupos paginados | `page, size, sort?` (query) | `ApiListResponse<GrupoResponse>` |
| POST | `/api/grupos` | Crear grupo | `GrupoRequest` (body) | `GrupoResponse` |
| PUT | `/api/grupos/{id}` | Actualizar grupo | `id: number`, `GrupoUpdate` (body) | `GrupoResponse` |
| DELETE | `/api/grupos/{id}` | Eliminar grupo | `id: number` | `void` |

**Parámetros de ordenamiento**:
- `sort`: String con formato `campo,dirección` (ej: `nombre,asc`)

### Recursos (`recurso.service.ts`)

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|----------|
| GET | `/api/recursos/{id}` | Obtener recurso por ID | `id: number` | `RecursoResponse` |
| GET | `/api/recursos` | Listar recursos con filtros | `page, size, grupoId?, tipo?, estado?` (query) | `ApiListResponse<RecursoResponse>` |
| POST | `/api/recursos` | Crear recurso | `RecursoRequest` (body) | `RecursoResponse` |
| PUT | `/api/recursos/{id}` | Actualizar recurso | `id: number`, `RecursoUpdate` (body) | `RecursoResponse` |
| DELETE | `/api/recursos/{id}` | Eliminar recurso | `id: number` | `void` |

**Filtros disponibles**:
```typescript
interface FiltrosRecurso {
  grupoId?: number;
  tipo?: string;      // Ej: 'HABITACION', 'OBJETO', 'COCINA', 'BAÑO'
  estado?: string;    // Ej: 'DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO'
}
```

### Reservas (`reserva.service.ts`)

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|----------|
| GET | `/api/reservas/{id}` | Obtener reserva por ID | `id: number` | `ReservaResponse` |
| GET | `/api/reservas` | Listar reservas con filtros | `page, size, recursoId?, usuarioId?, fecha?, estado?` (query) | `ApiListResponse<ReservaResponse>` |
| POST | `/api/reservas` | Crear reserva | `ReservaRequest` (body) | `ReservaResponse` |
| PUT | `/api/reservas/{id}` | Actualizar reserva | `id: number`, `ReservaUpdate` (body) | `ReservaResponse` |
| DELETE | `/api/reservas/{id}` | Eliminar reserva | `id: number` | `void` |

**Filtros disponibles**:
```typescript
interface FiltrosReserva {
  recursoId?: number;
  usuarioId?: number;
  fecha?: string;     // Formato ISO: YYYY-MM-DD
  estado?: string;    // Ej: 'CONFIRMADA', 'CANCELADA', 'PENDIENTE'
}
```

### Miembros de Grupo (`miembro-grupo.service.ts`)

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|----------|
| GET | `/api/miembros/{id}` | Obtener miembro por ID | `id: number` | `MiembroGrupoResponse` |
| GET | `/api/miembros` | Listar miembros paginados | `page, size` (query) | `ApiListResponse<MiembroGrupoResponse>` |
| POST | `/api/miembros` | Agregar miembro al grupo | `MiembroGrupoRequest` (body) | `MiembroGrupoResponse` |
| PUT | `/api/miembros/{id}` | Actualizar miembro | `id: number`, `MiembroGrupoUpdate` (body) | `MiembroGrupoResponse` |
| DELETE | `/api/miembros/{id}` | Eliminar miembro del grupo | `id: number` | `void` |

### Reglas de Recursos (`regla-recurso.service.ts`)

| Método | Endpoint | Descripción | Parámetros | Respuesta |
|--------|----------|-------------|------------|----------|
| GET | `/api/reglas/{id}` | Obtener regla por ID | `id: number` | `ReglaRecursoResponse` |
| GET | `/api/reglas` | Listar reglas paginadas | `page, size` (query) | `ApiListResponse<ReglaRecursoResponse>` |
| POST | `/api/reglas` | Crear regla | `ReglaRecursoRequest` (body) | `ReglaRecursoResponse` |
| PUT | `/api/reglas/{id}` | Actualizar regla | `id: number`, `ReglaRecursoUpdate` (body) | `ReglaRecursoResponse` |
| DELETE | `/api/reglas/{id}` | Eliminar regla | `id: number` | `void` |


## Interfaces TypeScript

### Interfaces de Paginación

```typescript
// Respuesta del backend de paginación(Spring Data Page)
interface BackendPage<T> {
  content: T[];
  totalElements: number;
}

// Respuesta adaptada para el frontend
interface ApiListResponse<T> {
  items: T[];
  total: number;
}
```

**Transformación**: Los servicios transforman automáticamente `BackendPage` a `ApiListResponse` usando RxJS:

```typescript
map(res => ({ items: res.content, total: res.totalElements }))
```

### Interfaces de Entidades

#### Usuario

##### UsuarioResponse (GET)

Representa los datos de un usuario obtenidos del servidor. Se utiliza como respuesta en operaciones GET (consulta de usuarios). Contiene información completa del perfil del usuario incluyendo datos de contacto y referencias a su membresía de grupo si existe.

```typescript
interface UsuarioResponse {
  id?: number;
  nombre?: string;
  apellidos?: string;
  email?: string;
  fotoPerfil?: string;
  pais?: string;
  ciudad?: string;
  telefono?: string;
  fechaRegistro?: string;
  miembroGrupoId?: number;
}
```

##### UsuarioRequest (POST)

Define los datos necesarios para crear un nuevo usuario. Se utiliza en operaciones POST para el registro de usuarios. Todos los campos básicos (nombre, apellidos, email, password) son obligatorios.

```typescript
export interface UsuarioRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  fotoPerfil?: string;
  pais?: string;
  ciudad?: string;
  telefono?: string;
}
```

##### UsuarioUpdate (PUT)

Define los campos modificables de un usuario existente. Se utiliza en operaciones PUT para actualizar información del perfil. Todos los campos son opcionales, permitiendo actualizaciones parciales.

```typescript
export interface UsuarioUpdate {
  nombre?: string;
  apellidos?: string;
  email?: string;
  password?: string;
  fotoPerfil?: string;
  pais?: string;
  ciudad?: string;
  telefono?: string;
}
```

#### Grupo

##### GrupoResponse (GET)

Representa un grupo de convivencia obtenido del servidor. Contiene información completa del grupo incluyendo su configuración, código de invitación, y referencias a miembros y recursos asociados.

```typescript
interface GrupoResponse {
  id?: number;
  nombre?: string;
  direccion?: string;
  descripcion?: string;
  fotoGrupo?: string;
  codigoInvitacion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  miembrosIds?: number[];
  recursosIds?: number[];
  creadorId?: number;
}
```

##### GrupoRequest (POST)

Define los datos necesarios para crear un nuevo grupo. El nombre y el ID del creador son obligatorios, mientras que la dirección, descripción y foto son opcionales.

```typescript
interface GrupoRequest {
  nombre: string;
  direccion?: string;
  descripcion?: string;
  fotoGrupo?: string;
  creadorId: number;
}
```

##### GrupoUpdate (PUT)

Define los campos modificables de un grupo existente. Permite actualizar la información básica del grupo de forma parcial. El código de invitación y el creador no son modificables.

```typescript
interface GrupoUpdate {
  nombre?: string;
  direccion?: string;
  descripcion?: string;
  fotoGrupo?: string;
}
```

#### Recurso

##### RecursoResponse (GET)

Representa un recurso compartido del grupo (habitación, objeto, etc.). Incluye información detallada del recurso, su estado actual, capacidad, y referencias a reservas y reglas asociadas.

```typescript
interface RecursoResponse {
  id?: number;
  nombre?: string;
  descripcion?: string;
  fotoRecurso?: string;
  capacidad?: number;
  ubicacion?: string;
  tipo?: TipoRecurso;
  estadoActual?: EstadoRecurso;
  grupoId?: number;
  numero?: number;
  creadorId?: number;
  reservasIds?: number[];
  reglasIds?: number[];
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
```

##### RecursoRequest (POST)

Define los datos necesarios para crear un nuevo recurso. El nombre, tipo, estado, grupo y creador son obligatorios. Permite especificar características como capacidad, ubicación y foto.

```typescript
interface RecursoRequest {
  nombre: string;
  descripcion?: string;
  fotoRecurso?: string;
  capacidad?: number;
  ubicacion?: string;
  tipo: TipoRecurso;
  estadoActual: EstadoRecurso;
  grupoId: number;
  creadorId: number;
}
```

##### RecursoUpdate (PUT)

Define los campos modificables de un recurso existente. Permite actualizar las características del recurso de forma parcial, incluyendo su estado, capacidad y ubicación.

```typescript
interface RecursoUpdate {
  nombre?: string;
  descripcion?: string;
  fotoRecurso?: string;
  capacidad?: number;
  ubicacion?: string;
  tipo?: TipoRecurso;
  estadoActual?: EstadoRecurso;
}
```

#### Reserva

##### ReservaResponse (GET)

Representa una reserva de recurso obtenida del servidor. Incluye la fecha, horarios, estado y detalles adicionales como número de personas y notas asociadas a la reserva.

```typescript
interface ReservaResponse {
  id?: number;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  notas?: string;
  numPersonas?: number;
  estado?: EstadoReserva;
  miembroGrupoId?: number;
  recursoId?: number;
  numero?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
```

##### ReservaRequest (POST)

Define los datos necesarios para crear una nueva reserva. La fecha, horarios, estado, miembro y recurso son obligatorios. Permite añadir información adicional como notas y número de personas.

```typescript
interface ReservaRequest {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  notas?: string;
  numPersonas?: number;
  estado: EstadoReserva;
  miembroGrupoId: number;
  recursoId: number;
}
```

##### ReservaUpdate (PUT)

Define los campos modificables de una reserva existente. Permite actualizar horarios, fecha, estado y detalles adicionales. Útil para modificar o confirmar reservas pendientes.

```typescript
interface ReservaUpdate {
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  notas?: string;
  numPersonas?: number;
  estado?: EstadoReserva;
}
```

#### MiembroGrupo

##### MiembroGrupoResponse (GET)

Representa la relación entre un usuario y un grupo. Incluye el rol del miembro, fecha de unión, estado activo, y referencias a los recursos y reservas asociados al miembro.

```typescript
interface MiembroGrupoResponse {
  id?: number;
  usuarioId?: number;
  grupoId?: number;
  rol?: RolGrupo;
  fechaUnion?: string;
  recursosIds?: number[];
  reservasIds?: number[];
  activo?: boolean;
}
```

##### MiembroGrupoRequest (POST)

Define los datos necesarios para agregar un miembro al grupo. El usuario y el grupo son obligatorios. El rol por defecto se asigna según la lógica del servidor si no se especifica.

```typescript
interface MiembroGrupoRequest {
  usuarioId: number;
  grupoId: number;
  rol?: RolGrupo;
  activo?: boolean;
}
```

##### MiembroGrupoUpdate (PUT)

Define los campos modificables de un miembro existente. Permite cambiar el rol del miembro o activar/desactivar su participación. Útil para gestión de permisos y moderación del grupo.

```typescript
interface MiembroGrupoUpdate {
  rol?: RolGrupo;
  activo?: boolean;
}
```

#### ReglaRecurso

##### ReglaRecursoResponse (GET)

Representa una regla de uso de un recurso. Define restricciones como duración máxima u horarios de apertura. Incluye el tipo de regla, su valor, y el miembro que la creó.

```typescript
interface ReglaRecursoResponse {
  id?: number;
  tipoRegla?: TipoRegla;
  valor?: string;
  descripcion?: string;
  recursoId?: number;
  miembroCreadorId?: number;
  numero?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
```

##### ReglaRecursoRequest (POST)

Define los datos necesarios para crear una nueva regla. El tipo, valor, recurso y miembro creador son obligatorios. El valor debe ser apropiado según el tipo de regla definido.

```typescript
interface ReglaRecursoRequest {
  tipoRegla: TipoRegla;
  valor: string;
  descripcion?: string;
  recursoId: number;
  miembroId: number;
}
```

##### ReglaRecursoUpdate (PUT)

Define los campos modificables de una regla existente. Permite actualizar el tipo, valor o descripción de la regla. Útil para ajustar restricciones según las necesidades del grupo.

```typescript
interface ReglaRecursoUpdate {
  tipoRegla?: TipoRegla;
  valor?: string;
  descripcion?: string;
}
```

### Tipos del Backend

```typescript
type RolGrupo = string;        // 'ADMIN' | 'MIEMBRO' | 'CREADOR'
type TipoRecurso = string;     // 'HABITACION' | 'OBJETO' | 'COCINA' | 'BAÑO'
type EstadoRecurso = string;   // 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO'
type TipoRegla = string;       // 'DURACION_MAX' | 'HORARIO_APERTURA'
type EstadoReserva = string;   // 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE'
```


