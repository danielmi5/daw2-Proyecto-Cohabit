# Contribuyendo al Proyecto Cohabit

¡Gracias por tu interés en contribuir! Este documento describe el flujo de trabajo recomendado, convenciones de commits y cómo ejecutar pruebas localmente.

## Flujo de trabajo

- Haz un fork del repositorio.
- Clona tu fork:

```bash
git clone <tu-fork-url>
cd daw2-Proyecto-Cohabit
```

- Crea una rama nueva para tu trabajo:

```bash
git checkout -b feature/descripcion-corta
```

- Haz commits claros y atómicos. Sigue el formato: `tipo(scope): mensaje corto` (ejemplo: `feat(frontend): añadir componente de login`).

- Mantén tu rama actualizada con la rama `develop` del upstream:

```bash
git remote add upstream <url-del-repo-original> || true
git fetch upstream
git checkout develop
git pull upstream develop
git checkout feature/descripcion-corta
git rebase develop
```

- Cuando tu cambio esté listo, push y abre un Pull Request desde tu fork hacia `develop`.

## Formato de commits (recomendado)

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, estilo, sin cambios funcionales
- `refactor`: Refactorización de código
- `test`: Añadir o corregir tests
- `chore`: Tareas del mantenimiento

Ejemplo:

```bash
git commit -m "feat(frontend): añadir validación al formulario de registro"
```

## Proceso de pull request

- Describe brevemente el objetivo del PR y los cambios principales.
- Añade capturas de pantalla si el cambio afecta UI.
- Asigna revisores si procede y responde a las sugerencias de revisión.
- Asegúrate de que los tests relevantes pasan antes de solicitar la fusión.

## Ejecutar el proyecto localmente

Backend (Java + Maven):

```bash
cd backend
mvn spring-boot:run
```

Frontend (Angular):

```bash
cd frontend
npm install
npm start
```

Servicios docker (opcional):

```bash
docker-compose up --build
```

## Ejecutar tests

- Backend: desde la carpeta `backend` ejecuta:

```bash
mvn test
```

- Frontend: desde la carpeta `frontend` ejecuta:

```bash
npm test
```

## Estándares de código

- Backend: Java 21, sigue las convenciones de estilo del proyecto (usa los mismos paquetes y convenciones ya presentes).
- Frontend: Angular 20, usa TypeScript estricto donde sea posible y sigue la estructura de carpetas existente.

## Reportar Issues

Si encuentras un bug o tienes una propuesta de mejora, abre un `Issue` describiendo:

- Qué esperabas que pasara
- Qué pasó en realidad
- Pasos para reproducir el problema
- Entorno (SO, versión de Java/Node, navegador si aplica)

## Código de Conducta

Al contribuir a este proyecto se espera un comportamiento respetuoso y profesional. Respeta a los demás colaboradores y mantén las discusiones centradas en el código y su mejora.

---

Gracias por colaborar, tu ayuda hace que el proyecto mejore.