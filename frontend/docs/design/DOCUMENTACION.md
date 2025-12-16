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

Cada entrada contiene: `- tag`: breve descripción. Por ejemplo:

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

Reglas y buenas prácticas aplicadas:

- Agrupa controles relacionados con `fieldset` y describe el grupo con `legend`.
- Asocia siempre `label` con `input` mediante `for` y `id`, o envolviendo el `input` con el `label` (ambas formas son accesibles).
- Añade `aria-describedby` para relacionar un `input` con un `small` que contiene texto de ayuda.
- Muestra mensajes de error usando `role="alert"` y `aria-invalid="true"` en el `input` cuando corresponde.

Ejemplo de estructura:

```html
<form>
  <fieldset>
    <legend>Información personal</legend>

    <label for="nombre">Nombre
      <input id="nombre" name="nombre" type="text" required />
    </label>

    <label for="email">Correo electrónico
      <input id="email" name="email" type="email" aria-describedby="email-help" required />
      <small id="email-help">Nunca compartiremos tu email</small>
    </label>
  </fieldset>
</form>
```

Ejemplo del componente `form-input` (uso recomendado dentro de formularios):

```html
<!-- Uso del componente presentacional -->
<app-form-input
  id="example-email"
  nombre="email"
  tipo="email"
  etiqueta="Correo electrónico"
  placeholder="tu@ejemplo.com"
  [requerido]="true"
  textoAyuda="Nunca compartiremos tu email"
>
  <!-- Etiqueta envolviendo el control y el texto de ayuda -->
  <label>
    Correo electrónico
    <input
      id="example-email"
      name="email"
      type="email"
      required
      aria-describedby="example-email-ayuda"
      placeholder="tu@ejemplo.com"
    />
    <small id="example-email-ayuda">Nunca compartiremos tu email</small>
  </label>

  <!-- Mensaje de error y ayuda proyectados -->
  <div fi-error>Introduce un correo válido</div>
  <div fi-help>Usa tu correo de trabajo</div>
</app-form-input>
```

Notas finales:

- El componente `form-input` del proyecto está pensado para ser presentacional: la lógica de validación y estado (mostrar `mensajeError`, `hayError`) se maneja desde el `ts` del formulario que lo utiliza.
- Se mantiene accesibilidad mediante: `aria-describedby`, `aria-invalid` y `role="alert"` ayudan a lectores de pantalla a informar estados y ayudas.
