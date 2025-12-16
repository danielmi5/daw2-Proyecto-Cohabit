# Seguridad

Documentación de la capa de seguridad del backend, su estructura de carpetas y responsabilidades.

## Estructura de carpetas

### DTO
Se encuentra en [backend/src/main/java/com/cohabit/cohabit_backend/security/auth/dto/]

Son los DTOs utilizados en los endpoints de autenticación y registro. Validan entrada y modelan la respuesta mínima que necesita el cliente para autenticarse.


#### AuthRequestDTO
	Es la petición de autenticación; se utiliza para el inicio de sesión. Contiene los campos `email` y `password` con validaciones (`@NotBlank`, `@Email`) para rechazar peticiones incorrectas antes de entrar en la lógica de servicio.

#### AuthResponseDTO
	Es la respuesta tras autenticarse; contiene el `token` JWT. Se devuelve al hacer registro/login para que el cliente lo almacene y lo añada como header `Authorization: Bearer {token}` en llamadas subsiguientes.

#### RegisterRequestDTO
	Es la petición de registro; contiene los campos: `nombre`, `apellidos`, `email`, `password`, `rol` (opcional, se usa en tests; por defecto es `USUARIO`). Incluye validaciones para garantizar integridad mínima antes de persistir.


### Servicio de autenticación
Se encuentra en [backend/src/main/java/com/cohabit/cohabit_backend/security/auth/service/]

Lógica de negocio para iniciar sesión, registrar usuarios y gestionar logout (revocación de tokens). Incluye la adaptación de la entidad `Usuario` a `UserDetailsService` de Spring Security.

#### AutenticacionService
- `iniciarSesion(AuthRequestDTO)`: autentica mediante `AuthenticationManager`, carga el `Usuario` y genera token JWT con `JwtService`.
- `registrar(RegisterRequestDTO)`: valida unicidad del email, construye `Usuario` (asignando `rol` por defecto si falta), persiste la entidad y devuelve `AuthResponseDTO` con token para uso inmediato.
- `cerrarSesion(String authorizationHeader)`: extrae el token (`Bearer ...`), obtiene el `jti` y lo invalida mediante `TokenInvalidadoService`.


#### DetallesUsuarioService
Implementa `UserDetailsService`. Carga `Usuario` por `email` desde el repositorio y convierte su `rol` en `GrantedAuthority` con prefijo `ROLE_`. Se inyecta en la configuración de autenticación (`DaoAuthenticationProvider`) para validar credenciales.

### Controlador de autenticación
Se encuentra en [backend/src/main/java/com/cohabit/cohabit_backend/security/auth/controller/]

Se encarga de exponer endpoints REST públicos para login, registro y logout, y de validar entradas y mapear respuestas a DTOs.

#### AutenticacionController
- `POST /auth/login`: recibe `AuthRequestDTO`, delega a `AutenticacionService.iniciarSesion`, devuelve `AuthResponseDTO` (200).
- `POST /auth/register`: recibe `RegisterRequestDTO`, delega a `AutenticacionService.registrar`, devuelve `AuthResponseDTO` (201 Created).
- `POST /auth/logout`: requiere cabecera `Authorization`, delega a `AutenticacionService.cerrarSesion` y devuelve un mensaje de confirmación (200).


### JWT (servicios y filtro)
Se encuentra en [backend/src/main/java/com/cohabit/cohabit_backend/security/jwt/]

Se encarga de la generación, parsing, validación y revocación del token JWT. Integración con la cadena de filtros de Spring Security.

#### JwtService
Genera tokens firmados (HMAC) incluyendo claims: `sub` (email), `roles`, `exp`, `jti`, `iat`. Proporciona métodos: `extraerEmail`, `extraerJti`, `extraerExpiracionToken`, `esTokenValido`.
	

#### FiltroAutenticacionJwt
Intercepta cada petición. Flujo: 
1. Extrae header `Authorization`
2. Valida formato `Bearer `
3. Usa `JwtService` para parsear y validar
4. Comprueba `jti` en `TokenInvalidadoService`
5. Construye `Authentication` y lo setea en `SecurityContext`.

También maneja casos de token no válido/expirado devolviendo 401 desde `AuthenticationEntryPoint` configurado.

#### TokenInvalidadoService
Implementación en memoria que almacena `jti` hasta la expiración del token. Limpia entradas expiradas de forma periódica o al insertar.

### Configuración de seguridad
Se encuentra en [backend/src/main/java/com/cohabit/cohabit_backend/security/config/]

Define la configuración de seguridad de la cadena de filtros, reglas de acceso por URL/método y política de sesión (stateless).

#### ConfiguracionSeguridad
- Registra `FiltroAutenticacionJwt` antes de `UsernamePasswordAuthenticationFilter`.
- Define endpoints públicos: `/auth/login`, `/auth/register` y otras rutas de desarrollo (H2, Swagger) cuando aplica.
- Protege `/api/**` y aplica reglas por método (`hasRole("ADMIN")` para rutas administrativas).
- Establece `SessionCreationPolicy.STATELESS` y configura `AuthenticationEntryPoint` para devolver 401 en JSON.


### Autorización específica del dominio
Se encuentra en [backend/src/main/java/com/cohabit/cohabit_backend/security/authorization/]

Encapsula reglas de autorización que combinan información de negocio (miembros, creadores, propietarios) con roles, para usar desde anotaciones `@PreAuthorize`.

#### GrupoSecurityService
Se invoca desde expresiones SpEL, por ejemplo `@PreAuthorize("@grupoSecurity.esCreadorOAdmin(#grupoId)")` en controladores, para validar. Métodos expuestos: `esMiembro(grupoId)`, `esCreadorOAdmin(grupoId)`, `esUsuarioIdActual(usuarioId)`, `esPropietarioReserva(reservaId)`, `comparteGrupoConUsuario(usuarioId)`, etc.

#### RolSeguridad
Los roles que va a tener el usuario (USUARIO o ADMIN).


## Claims y formato del token JWT
El token generado incluye los siguientes claims:
- `sub` (subject): email del usuario.
- `roles`: lista de roles del usuario (ej. `ROLE_ADMIN`, `ROLE_USUARIO`).
- `exp`: fecha de expiración.
- `jti`: identificador único del token (usado para invalidación/revocación).
- `iat`: fecha de emisión.

## Configuración (application.properties)
```properties
# Clave secreta (Base64)
jwt.clave-secreta=... 

# Tiempo de expiración en ms (ej. 86400000 = 24h)
jwt.tiempo-expiracion=86400000
```

## Flujo de autenticación
1. Registro/login: `AutenticacionService` crea o autentica usuario y genera JWT.
2. Cliente añade header `Authorization: Bearer {token}` en peticiones.
3. `FiltroAutenticacionJwt` valida token y setea `Authentication`.
4. `@PreAuthorize` y las reglas en `ConfiguracionSeguridad` controlan acceso.
5. Para cerrar la sesión, `TokenInvalidadoService` añade `jti` a la lista negra.


## Buenas prácticas implementadas
- Contraseñas con `BCryptPasswordEncoder`.
- Tokens firmados (HMAC-SHA* via `io.jsonwebtoken`).
- Lista negra de tokens en memoria con limpieza periódica (adecuada para entornos de pruebas; para producción usar solución distribuida).
- Sesiones stateless: sin cookies de sesión.
- Validación de DTOs con anotaciones `jakarta.validation`.

## Rutas protegidas y roles
- Endpoints de autenticación: públicos (`/auth/*`).
- Resto de la API: requiere autenticación.
- Ejemplos de restricciones:
	- Operaciones administrativas → `ROLE_ADMIN`.
	- Acciones sobre recursos/grupos → combinaciones de `@PreAuthorize` y comprobaciones en `GrupoSecurityService`.

## Tests de integración y utilidades de test
- Clase helper: `AutenticadorTests` (en `src/test/...`) que registra usuarios de prueba y obtiene tokens JWT (`ADMIN`, `USUARIO`).
- Los tests usan estos tokens en el header `Authorization` para verificar comportamiento autorizado y no autorizado (401/403).



