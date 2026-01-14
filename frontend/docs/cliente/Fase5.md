# Fase 5: Servicios y comunicación HTTP

## Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura de Servicios](#arquitectura-de-servicios)
3. [Catálogo de Endpoints](#catálogo-de-endpoints)


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
