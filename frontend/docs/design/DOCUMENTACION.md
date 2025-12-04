# Documentación Diseño

## Sección 1: Arquitectura CSS y comunicación visual.

### 1.1 Principios de comunicación visual

#### 1. Jerarquía: Cómo usas tamaños, pesos y espaciado para crear importancia visual



#### 2. Contraste: Cómo usas color, tamaño y peso para diferenciar elementos



#### 3. Alineación: Tu estrategia de alineación (izquierda, centro, grid)



#### 4.Proximidad: Cómo agrupas elementos relacionados con espaciado



#### 5.Repetición: Cómo creas coherencia repitiendo patrones visuales



### 1.2 Metodología CSS

Se va a utilizar la metodología BEM porque..

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