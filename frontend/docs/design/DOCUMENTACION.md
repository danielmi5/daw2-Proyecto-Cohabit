# Documentación Diseño

## Sección 1: Arquitectura CSS y comunicación visual

### 1.1 Principios de comunicación visual

#### 1. Jerarquía: Cómo usas tamaños, pesos y espaciado para crear importancia visual



#### 2. Contraste: Cómo usas color, tamaño y peso para diferenciar elementos



#### 3. Alineación: Tu estrategia de alineación (izquierda, centro, grid)



#### 4.Proximidad: Cómo agrupas elementos relacionados con espaciado



#### 5.Repetición: Cómo creas coherencia repitiendo patrones visuales



### 1.2 Metodología CSS

Se utiliza la metodología BEM y una organización basada en ITCSS.

### 1.3 Organización de archivos

La organización sigue la filosofía ITCSS (de menor a mayor especificidad). Empieza con archivos menos específicos (variables) y finaliza con archivos más específicos (layout).

- `00-settings/` : **Variables globales.** Contiene colores, tipografías, espaciados y breakpoints. Es la base; no genera CSS por sí misma, solo valores reutilizables.
- `01-tools/` : **Mixins, functions y helpers.** Reglas reutilizables que generan estilos cuando son invocadas.
- `02-generic/` : **Reset de estilos.** Incluye resets, normalizaciones y estilos globales (body, tipografías base). Afecta todo el proyecto y debe cargarse el primero para resetear el CSS.
- `03-elements/` : **Elementos HTML puros.** Estilos para etiquetas semánticas (a, h1-h6, p, ul, img).
- `04-layout/` : **Layout y estructuras de página.** Grid, contenedores y utilidades de layout. Estos estilos organizan la página y componen los elementos y componentes.

### 1.4 Sistema de Design Tokens

**Colores**: 
- **Selección del color primario (`$color-primario`, `$color-primario-claro`, `$color-primario-oscuro`)**: Estos colores transmite calma y moderna que funciona bien para componentes destacados (botones, enlaces importantes). Se definen variantes para estados y, para mantener contraste y consistencia en interacciones (hover/active).
- **Colores de soporte y complementarios**: Estos colores facilitan la lectura con fondos suaves y colores secundarios sin competir con el color principal. Esto permite crear capas visuales (cards, banners, fondos) manteniendo coherencia.
- **Escala de grises (`$blanco` a `$negro`)**: Proporciona colores neutros para textos, fondos y bordes. Los extremos son el blanco y el negro: 
También se definen 7 grises en una escala numerada para comprender rapidamente la diferencia de contraste para accesibilidad y jerarquía tipográfica.
- **Colores semánticos (`$color-success`, `$color-error`, `$color-warning`, `$color-info`)**: Se utilizan colores semánticos para estados o feedback al usuario (errores, información, advertencias y éxito).

**Escala tipográfica**: La escala va desde `$text-xs` (12px) hasta `$text-5xl` (64px), con `16px` definido como `$text-md` para párrafos. Esta elección obedece a una jerarquía clara: lectura cómoda (16px), subtítulos y títulos escalonados para distinguir niveles de contenido. H1–H4 se encargan del encabezamiento en las diferentes secciones (desde 64px para encabezados de alto impacto hasta 18–36px para títulos de sección). Se usa line-height para mantener la legibilidad.
También hay pesos para la tipografía (`$font-weight-regular`, `$font-weight-medium`, `$font-weight-bold`) para dar énfasis a las palabras de la interfaz: párrafos con "regular" (menos importante), palabras destacadas con "medium" (destacar sobre los demás), títulos con "bold" (más importante).


**Breakpoints**: Se han elegido esos breakpoints ya que son anchos generales de dispositivos (móviles grandes ~640px, tablets ~768px, escritorios estándar ~1024px y pantallas amplias ~1280px). Esto permite aplicar layout para pantallas específicas.


### 1.5 Mixins y funciones


### 1.6 ViewEncapsulation en Angular



## Sección 2: HTML semántico y estructura

### 2.1 Elementos semánticos utilizados


- `header`: se utiliza como encabezado de páginas o secciones. Por ejemplo:

```html
<header class="cabecera">
  <a routerLink="/" class="cabecera__logo">...</a>
  <nav class="cabecera__navegacion">...</nav>
  <section class="cabecera__utilidades">... botones ...</section>
</header>
```

- `nav`: contenedor de enlaces de navegación (menú principal o secundario). Por ejemplo:

```html
<nav aria-label="Menú principal" class="cabecera__navegacion">
  <ul class="cabecera__menu">
    <li><a routerLink="/inicio">INICIO</a></li>
    <li><a routerLink="/style-guide">STYLE GUIDE</a></li>
  </ul>
</nav>
```

- `main`: contenedor principal del contenido único de la página (un solo `main` por documento). Ejemplo:

```html
<main>
  <h1>Mi página</h1>
  <section>...</section>
</main>
```

Estructura de página (archivo `app.html`):

```html
<app-header></app-header>
  <router-outlet></router-outlet>
</app-main>
<app-footer></app-footer>
```

- `section`: agrupa contenido temático dentro de `main` o de otras secciones; normalmente con encabezado. Ejemplo:

```html
<section class="inicio__acciones">
  <h2>Acciones</h2>
  <a routerLink="/login">Inicia sesión</a>
</section>
```

- `article`: contenido independiente y autocontenido (tarjetas, artículos). Ejemplo:

```html
<article class="pie-pagina__seccion">
  <h3>Sobre Nosotros</h3>
  <nav>...</nav>
</article>
```

- `aside`: contenido complementario o secundario (barra lateral, widgets). Ejemplo:

```html
<aside class="barra-lateral">
  <!-- navegación secundaria y widgets -->
</aside>
```

- `footer`: pie de página con información secundaria, enlaces y redes sociales. Ejemplo:

```html
<footer class="pie-pagina">
  <section>...enlaces y redes...</section>
</footer>
```

- `form`: agrupa controles de entrada y botones para envío. Ejemplo:

```html
<form (submit)="onSubmit()">
  <!-- controles -->
</form>
```

- `fieldset` / `legend`: agrupan controles relacionados y proporcionan título al grupo. Ejemplo:

```html
<fieldset>
  <legend>Información personal</legend>
  <!-- inputs -->
</fieldset>
```

- `label`: asocia texto con un control `input` (usando `for`/`id` o envolviendo el `input`). Ejemplo:

```html
<label for="email">Correo electrónico
  <input id="email" name="email" type="email" />
</label>
```

- `input`: control de entrada para texto, email, password, etc. Ejemplo:

```html
<input id="nombre" name="nombre" type="text" placeholder="Tu nombre" required />
```

- `button`: elemento interactivo para acciones. Ejemplo:

```html
<button class="cabecera__boton" aria-label="Cambiar tema">Cambiar tema</button>
```

- `picture` / `img`: elementos para imágenes; `picture` permite variantes responsivas. Ejemplo:

```html
<picture>
  <img src="/header/perfil.svg" alt="Perfil" />
</picture>
```

### 2.2 Jerarquía de headings

Reglas aplicadas al proyecto:

- Se usa solo un `h1` por página (típicamente el título principal del `main`).
- Se usa `h2` para secciones principales dentro del `main`.
- Se usa `h3` para subsecciones dentro de cada `h2`.
- Se usa `h4` para articles como cards o componentes.
- No se realizan saltos entre niveles

Ejemplo de jerarquía:

![Diagrama de la jerarquía utilizada](img/jerarquia-headings.svg)

### 2.3 Estructura de formularios

En este proyecto seguimos buenas prácticas de accesibilidad y semántica en los formularios. A continuación se describe la estructura recomendada y cómo la usamos en los componentes.

- `fieldset` / `legend`:
  - `fieldset` agrupa controles relacionados (por ejemplo, datos personales, dirección, credenciales).
  - `legend` actúa como título del grupo y es leído por tecnologías de asistencia, por lo que mejora la accesibilidad.

  Ejemplo:

  ```html
  <fieldset>
    <legend>Datos personales</legend>
    <label for="nombre">Nombre</label>
    <input id="nombre" name="nombre" />

    <label for="apellidos">Apellidos</label>
    <input id="apellidos" name="apellidos" />
  </fieldset>
  ```

- Asociación de `label` con `input`:
  - Usar `for` en el `label` apuntando al `id` del `input` proporciona un objetivo claro para cliques y lectores de pantalla.
  - Además se puede envolver el `input` dentro del `label` también establecería la asociación:

  ```html
  <label>Correo electrónico
    <input type="email" name="email" />
  </label>
  ```

- Reglas prácticas aplicadas en el repo:
  - Siempre definir `id` en inputs que vayan a ser referenciados desde `label`.
  - Agrupar visual y semánticamente controles relacionados en `fieldset` con `legend` descriptivos.
  - Añadir atributos ARIA cuando sea necesario (por ejemplo, `aria-describedby` para textos de ayuda o mensajes de error).


#### Ejemplo del formulario usado en LoginForm para el login

```html
<form class="login-form" [formGroup]="formularioLogin" (ngSubmit)="onSubmit()" novalidate>
	<h2 class="login-form__title">Inicio de sesión</h2>

	<fieldset class="login-form__fieldset">
		<legend class="login-form__legend">Credenciales</legend>

        <app-form-input
            id="login-email"
            name="email"
            formControlName="email"
            etiqueta="Correo electrónico"
            placeholder="example@example.ext"
            [tipo]="'email'"
            [requerido]="true"
            [estadoValidacion]="getValidationState('email')"
            [mensajeAdvertencia]="getWarningMessage('email')"
            [mensajeError]="getErrorMessage('email')"
            [mensajeExito]="getSuccessMessage('email')"
            textoAyuda="Debe seguir el formato estándar de correo."
        ></app-form-input>

        <app-form-input
            id="login-password"
            name="password"
            formControlName="password"
            etiqueta="Contraseña"
            placeholder="Contraseña"
            [tipo]="'password'"
            [requerido]="true"
            [estadoValidacion]="getValidationState('password')"
            [mensajeAdvertencia]="getWarningMessage('password')"
            [mensajeError]="getErrorMessage('password')"
            [mensajeExito]="getSuccessMessage('password')"
            textoAyuda="Debe tener como mínimo 8 caracteres."
        ></app-form-input>

		<app-form-checkbox 
            id="login-remember" 
            name="remember" 
            formControlName="remember"
            etiqueta="Recuérdame"
        ></app-form-checkbox>

        <p class="login-form__cta">¿Aún no tienes una cuenta? - <a routerLink="/registro" class="login-form__cta-link">Regístrate</a></p>
	</fieldset>

	<footer class="login-form__botones">
		<app-button 
            variante="primario" 
            tipo="submit" 
            ariaLabel="Iniciar sesión"
            [deshabilitado]="formularioLogin.invalid"
        >
            Iniciar sesión
    </app-button>

		<app-button 
            variante="secundario" 
            tipo="button" 
            ariaLabel="Iniciar sesión con Google"
            (click)="onGoogleLogin()"
        >
            Iniciar sesión con Google
        </app-button>
	</footer>
</form>
```

Explicación de la estructura HTML seguida:

- El `form` está vinculado a un `FormGroup` mediante `[formGroup]="formularioLogin"`, de modo que Angular controla estado/valor/validación.
- Se usa `fieldset` + `legend` para agrupar las credenciales y aportar contexto semántico y accesible.
- Contiene una línea CTA (etiqueta p) con enlace, que ayuda al usuario a saber si debe registrarse o iniciar sesión y facilita el acceso al formulario contrario.
- Al final, el `footer` contiene los `app-button`: botón primario (submit) y botón secundario ("Iniciar sesión con Google").
- Cada control se encapsula en un componente `app-form-input` para mantener la plantilla limpia y reutilizable.
- Los `app-form-input` reciben `id` y `name` para facilitar la asociación con `label` si se usa fuera del componente, además de `placeholder` y `textoAyuda` para mejorar la UX.
- Para mensajes y estados se pasan propiedades como `[estadoValidacion]`, `[mensajeAdvertencia]`, `[mensajeError]` y `[mensajeExito]` que el componente muestra según el estado.
- El atributo `novalidate` en el `form` evita la validación nativa del navegador para delegar en el sistema reactivo de Angular.


#### Ejemplo del formulario usado en RegistroForm para el registro

```html
<form class="registro-form" [formGroup]="formularioRegistro" (ngSubmit)="onSubmit()" novalidate>
	<h2 class="registro-form__title">Registrarse</h2>

	<fieldset class="registro-form__fieldset">
		<legend class="registro-form__legend">Datos personales</legend>

		<app-form-input 
			class="registro-form__half" 
			id="nombre" 
			name="nombre"
			formControlName="nombre"
			etiqueta="Nombre" 
			placeholder="Nombre"
			[requerido]="true"
			[estadoValidacion]="getValidationState('nombre')"
			[mensajeAdvertencia]="getWarningMessage('nombre')"
			[mensajeError]="getErrorMessage('nombre')"
			[mensajeExito]="getSuccessMessage('nombre')"
		></app-form-input>

		<app-form-input 
			class="registro-form__half" 
			id="apellidos" 
			name="apellidos"
			formControlName="apellidos"
			etiqueta="Apellidos" 
			placeholder="Apellidos"
			[requerido]="true"
			[estadoValidacion]="getValidationState('apellidos')"
			[mensajeAdvertencia]="getWarningMessage('apellidos')"
			[mensajeError]="getErrorMessage('apellidos')"
			[mensajeExito]="getSuccessMessage('apellidos')"
		></app-form-input>
	</fieldset>

	<fieldset class="registro-form__fieldset">
		<legend class="registro-form__legend">Cuenta</legend>

		<div class="registro-form__campo-async">
			<app-form-input 
				id="reg-email" 
				name="email"
				formControlName="email"
				etiqueta="Correo electrónico" 
				placeholder="example@example.ext" 
				[tipo]="'email'"
				[requerido]="true"
				[estadoValidacion]="getValidationState('email')"
				[mensajeAdvertencia]="getWarningMessage('email')"
				[mensajeError]="getErrorMessage('email')"
				[mensajeExito]="getSuccessMessage('email')"
			></app-form-input>
			@if (isEmailPending()) {
				<p class="registro-form__validando">Verificando disponibilidad...</p>
			}
		</div>

		<app-form-input 
			id="reg-pass" 
			name="password"
			formControlName="password"
			etiqueta="Contraseña" 
			placeholder="Contraseña" 
			[tipo]="'password'" 
			[requerido]="true"
			[estadoValidacion]="getValidationState('password')"
			[mensajeAdvertencia]="getWarningMessage('password')"
			[mensajeError]="getErrorMessage('password')"
			[mensajeExito]="getSuccessMessage('password')"
			textoAyuda="Debe ser una combinación mínima de 8 letras, números, y símbolos."
		></app-form-input>

		<app-form-input 
			id="reg-pass-confirm" 
			name="passwordConfirm"
			formControlName="passwordConfirm"
			etiqueta="Confirmar contraseña" 
			placeholder="Repite la contraseña" 
			[tipo]="'password'"
			[requerido]="true"
			[estadoValidacion]="getValidationState('passwordConfirm')"
			[mensajeAdvertencia]="getWarningMessage('passwordConfirm')"
			[mensajeError]="getErrorMessage('passwordConfirm')"
			[mensajeExito]="getSuccessMessage('passwordConfirm')"
			textoAyuda="Deben coincidir las contraseñas."
		></app-form-input>

		<app-form-checkbox 
			id="check-politicas" 
			name="terminos"
			formControlName="terminos"
			[requerido]="true"
		>
			He leído y acepto los <a routerLink="/terminos">Términos y Condiciones</a> y la <a routerLink="/privacidad">Política de Privacidad</a>
		</app-form-checkbox>
		@if (shouldShowError('terminos')) {
			<p class="registro-form__error">{{ getWarningMessage('terminos') }}</p>
		}

		<p class="registro-form__cta">¿Ya tienes una cuenta? - <a routerLink="/login" class="registro-form__cta-link">Inicia Sesión</a></p>
	</fieldset>

	<footer class="registro-form__botones">
		<app-button 
			variante="primario" 
			tipo="submit" 
			ariaLabel="Registrarse"
			[deshabilitado]="formularioRegistro.invalid || isFormPending()"
		>
			{{ getSubmitButtonText() }}
		</app-button>

		<app-button 
			variante="secundario" 
			tipo="button" 
			ariaLabel="Continuar con Google"
			(click)="onGoogleRegister()"
		>
			Continuar con Google
		</app-button>
	</footer>
</form>

```

Explicación de la estructura HTML:

- El `form` está enlazado a `formularioRegistro` mediante `[formGroup]`, por tanto Angular gestiona valores, estados y validaciones.
- Se organizan dos `fieldset` claros: uno para "Datos personales" y otro para "Cuenta"; cada `fieldset` tiene su `legend` que aporta contexto y accesibilidad.
- Cada campo se implementa con el componente reutilizable `app-form-input`. Este componente encapsula el `input` y la presentación (etiqueta, placeholder, mensajes) y se integra con el `FormGroup` usando `formControlName`.
- Contiene una línea CTA (etiqueta p) con enlace, que ayuda al usuario a saber si debe registrarse o iniciar sesión y facilita el acceso al formulario contrario.
- Al final, el `footer` contiene los `app-button`: botón primario (submit) y botón secundario ("Continuar con Google").
- Manejo de validaciones asíncronas: el campo `email` muestra un indicador (`Verificando disponibilidad...`) mientras `isEmailPending()` es `true` (control `pending`).
- Checkbox de términos: se usa `app-form-checkbox` y, si se desmarca, se muestra el mensaje de advertencia desde `shouldShowError('terminos')`.
- `novalidate` en el `form` desactiva la validación nativa del navegador para delegar completamente en la validación reactiva de Angular.
- Botones: el botón de submit está deshabilitado cuando `formularioRegistro.invalid` o `isFormPending(), esto evita envíos no válidos o mientras hay validaciones pendientes.

#### Propiedades utilizadas en form-input:

```ts
export type EstadoValidacion = 'inicial' | 'advertencia' | 'error' | 'exito';
export class FormInput implements ControlValueAccessor {
  @Input() tipo: string = 'text';
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() etiqueta: string = '';
  @Input() placeholder: string = '';
  @Input() requerido: boolean = false;
  @Input() mensajeAdvertencia?: string;
  @Input() mensajeError?: string;
  @Input() estadoValidacion: EstadoValidacion = 'inicial';
}
```

Explicación de las propiedades de `app-form-input`:

- `tipo`: tipo de input (`text`, `email`, `password`, etc.). Determina el `type` del elemento `input` interno.
- `name`: nombre del control para identificar el campo.
- `id`: identificador DOM del input; se usa para asociar `label` externos (`for="id"`) y para accesibilidad.
- `etiqueta`: texto visible del `label` que muestra el componente; mejora la semántica y UX.
- `placeholder`: texto auxiliar dentro del input para orientar al usuario sobre el formato esperado.
- `requerido`: indica si el campo es obligatorio; el componente puede usarlo para añadir el asterisco (*) visual y para lógica de presentación de advertencias.
- `mensajeAdvertencia`: texto mostrado cuando el estado es `advertencia` (p. ej. campo obligatorio vacío tras interacción).
- `mensajeError`: texto mostrado cuando el estado es `error` (p. ej. formato inválido, validación fallida).
- `estadoValidacion`: enum local que indica el estado efectivo del control (`inicial`, `advertencia`, `error`, `exito`). El componente lo usa para aplicar estilos y decidir qué mensaje mostrar.


HTML del componente input:




Con esta estructura se logra una interfaz accesible y consistente: los `label` enlazan con los `input`, los `fieldset` aportan contexto y los componentes reutilizables (`app-form`) encapsulan la lógica de `ControlValueAccessor` para integrarse con `FormGroup`.

