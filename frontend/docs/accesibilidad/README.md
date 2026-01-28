# Accesibilidad

## Sección 1: Fundamentos de accesibilidad

### ¿Por qué es necesaria la accesibilidad web?

La accesibilidad web garantiza que todas las personas, independientemente de sus capacidades, puedan usar, comprender y participar en servicios digitales. Facilita el acceso a información y trámites, reduciendo barreras sociales, ofreciendo acceso igualitario e igualdad de oportunidades. Es un requisito muy importante de usabilidad e igualdad. 

La accesibilidad mejora la usabilidad general: contenidos más claros, navegación más sencilla y compatibilidad con distintos dispositivos mejora la experiencia para todos los usuarios, no solo a personas con discapacidad. Esto incluye también a personas con discapacidad como para mayores, personas en zonas rurales o en países en desarrollo. Además también beneficia a personas en diferentes situaciones como:

- Uso de diferentes tamaños de pantalla.
- Uso en la luz o en la oscuridad.
- Uso con conexión lenta.
- Uso de diferentes periféricos de entrada.

Y más. Existen muchos tipos de discapacidad, estos son algunos de ellos:
- Visual: engloba cualquier alteración en el sentido de la vista, pudiendo ser ceguera total, baja visión o daltonismo.
- Auditiva: es la condición que puede afectar a la capacidad de una persona para escuchar. Puede ser sordera parcial o total.
- Motora: dificultades para moverse o coordinarse.
- Cognitiva: afecta a los procesos que usamos para pensar y recordar. Dificultades de atención, memoria, razonamiento o resolución de problemas.



### Obligatoriedad legal en España/Europa

#### Europa 
La Unión Europea ha aprobado varias directivas y normas que establecen requisitos de accesibilidad. Las más relevantes son:
- `EN 301 549`: es una norma europea armonizada voluntaria con un amplio conjunto de requisitos, creada originalmente para proporcionar requisitos de accesibilidad para todos los productos y servicios TIC. Sirve como referencia técnica para cumplir las directivas europeas y proporciona criterios detallados basados en los principios WCAG.
- `Directiva (UE) 2016/2102` (Web Accessibility Directive): obliga a que los sitios web y las aplicaciones móviles del sector público sean accesibles y exige la publicación de declaraciones de accesibilidad y la realización de controles periódicos y planes de remediación.
- `Directiva (UE) 2019/882`  European Accessibility Act (EAA): establece requisitos de accesibilidad para determinados productos y servicios en el mercado (por ejemplo, ordenadores, teléfonos, servicios de banca en línea, e‑comercio, libros electrónicos). Entro en vigor para todos sus miembros en junio de 2025.



#### España

El 28 de junio de 2025 entró en vigor la European Accessibility Act en España (transpuesta como `Ley 11/2023`) y por primera vez las empresas privadas tienen la obligación legal de garantizar que sus productos digitales sean accesibles. También existen las siguientes leyes: 
- `Ley 34/2002`: Los sitios web del sector público deben ser accesibles.
- `Ley 51/2003`: Prohíbe la discriminación por motivos de discapacidad en:
	- Telecomunicaciones y sociedad de la información.
	- Espacios públicos urbanos, infraestructuras y edificios
	- Transporte.
	- Bienes y servicios a disposición del público.
	- Relaciones con los órganos de la Administración Pública.
- `Real Decreto 1112/2018`: Los sitios web y las aplicaciones móviles del sector público deben ser accesibles.


### Principios WCAG 2.1

1. **Perceptible:** La información y los componentes de la interfaz deben presentarse de formas que los usuarios puedan percibir. Proporcionando alternativas textuales a elementos multimedia, contenido adaptable y distinguible. 
	- Ejemplo: Las imágenes usadas de todo el proyecto incluyen texto alternativo descriptivo para usuarios que usan lectores de pantalla.

2. **Operable:** Los componentes de la interfaz y la navegación deben ser operables por el usuario. Facilita la experiencia del usuario, funcionalidades accesibles (por teclado, diferentes maneras para introducir información..) y, contenido navegable y no perjudicial para la salud.
	- Ejemplo: Todos los enlaces y funcionalidades se pueden acceder por teclado (tabulación) sin depender del ratón.

3. **Comprensible:** La información y el funcionamiento de la interfaz deben ser comprensibles. El contenido debe ser fácil de leer, entender y predecir. Además de ayuda en la introducción de datos para evitar errores. 
	- Ejemplo: Los formularios muestran etiquetas claras, instrucciones breves y mensajes de error fáciles de entender. Así como colores para dar más visibilidad y comprensión al usuario.

4. **Robusto:** El contenido debe ser lo suficientemente robusto como para ser compatible con las herramientas de usuario actuales y futuras.
	- Ejemplo: Uso de HTML semántico y roles ARIA donde procede para que lectores de pantalla y navegadores antiguos interpreten correctamente la página.

### Niveles de conformidad

- Nivel A: requisitos básicos de accesibilidad (mínimos esenciales) que deben ser implementados para garantizar que un sitio web sea usable por personas con discapacidades.
- Nivel AA: incluye todos los criterios del nivel A, además de requisitos adicionales que abordan problemas de accesibilidad más comunes y significativos. Es el objetivo habitual para proyectos y normativa, está diseñado para ser el estándar mínimo para alcanzar una buena accesibilidad web.
- Nivel AAA: representa el grado más alto de accesibilidad web, seguir este nivel significa cumplir con los estándares más exigentes y abordar una amplia gama de necesidades especiales y situaciones.

**Objetivo del proyecto**: alcanzar el nivel AA de conformidad WCAG 2.1.

## Sección 2: Componente multimedia implementado

El componente multimedia implementado es un carrusel.

Este componente se ha incluido en el dashboard (`/dashboard`) y muestra una lista de hasta 5 cards informativas de recursos (nombre, estado, próxima reserva). Tiene botones, en forma de icono de "flecha", en los extremos de la lista para poder moverse en el carrusel. Se elegió para el dashboard porque es un espacio destinado a mostrar información breve y directa sobre el estado del usuario. Por lo que la lista de recursos no debe exceder la altura establecida del componente, por ello se optó implementar un carrusel que mantiene ocultos los recursos adicionales.

### Características de accesibilidad implementadas

1. 
2. 
3. 
4. 