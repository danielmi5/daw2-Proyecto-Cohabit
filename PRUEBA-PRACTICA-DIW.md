# Justificación DIW

1. Arquitectura: ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components? ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?

Los he colocado en la capa settings porque es donde se definen las variables globales del proyecto. Al estar implementando la arquitectura ITCSS, se importa el primero, porque es donde se definen todas las variables que van a usar los demás archivos de estilos SASS. 
Los estilos los he colocado en components porque ahí defino los estilos específicos que va a recibir cada componente. Y se importa  el último porque los demás partials definen los estilos globalos que van a seguir las variables, elementos HTML, mixins y layouts, y los componentes utilizan sus propiedades y son afectados por lo definido. Además los estilos se cargan en cascada.

2. Metodología: Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).

La ventaja que me ha dado utilizar la metodología BEM en este examen, más concretamente al utilizar SASS, es que puedo utilizar la propiedad "&" para poder abreviar la clase y reducir el tiempo que tardo en colocar las clases. Además otra ventaja es que deja el código más organizado y más sencillo de leer, tanto para el HTML como para los archivos de estilos SCSS. Usar BEM me ha evitado también muchos problemas de especificidad que antes me ocurrían al usar etiquetas anidadas.


He utilizado lenguajehtml.com, saas-lang.com y lenguajecss.com.