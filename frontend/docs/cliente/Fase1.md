# Documentación fase 1

## Arquitectura de eventos

Este proyecto Angular utiliza un sistema de eventos robusto que combina eventos nativos del DOM con eventos personalizados para gestionar la interacción del usuario y la comunicación entre componentes.

### Tipos de eventos

#### 1. Eventos de UI (nativos del DOM)

El proyecto utiliza los siguientes eventos nativos para capturar la interacción del usuario:

- **`click`**: Interacción con botones, enlaces y elementos clicables
- **`input`**: Captura de cambios en tiempo real en campos de texto
- **`change`**: Detección de cambios en formularios (select, checkbox)
- **`blur`**: Validación cuando un campo pierde el foco
- **`focus`**: Activación de estados visuales en campos de entrada
- **`submit`**: Procesamiento de envío de formularios
- **`keydown`**: Captura de teclas presionadas para navegación por teclado
- **`keydown.escape`**: Detección específica de tecla Escape (con @HostListener)
- **`mouseenter`**: Detección cuando el cursor entra en un elemento
- **`mouseleave`**: Detección cuando el cursor sale de un elemento
- **`focusin`**: Detección cuando un elemento hijo recibe foco
- **`focusout`**: Detección cuando un elemento hijo pierde foco

**Ejemplo de uso en template:**

```html
<!-- Evento click para cambiar tema -->
<button class="cabecera__boton" (click)="alternarTema()">
  <span [feather]="modoIcon"></span>
</button>

<!-- Evento input para validación en tiempo real -->
<input 
  type="email"
  (input)="onInput($event)"
  (blur)="onBlur()"
/>

<!-- Evento keydown para navegación por teclado (tabs) -->
<button
  (click)="activarTab(1)"
  (keydown)="manejarTecla($event)"
  [attr.tabindex]="tabActivo === 1 ? 0 : -1">
  Tab 1
</button>

<!-- Eventos mouseenter/mouseleave para tooltips -->
<div class="tooltip-contenedor"
     (mouseenter)="onMouseEnter()"
     (mouseleave)="onMouseLeave()"
     (focusin)="onFocusIn()"
     (focusout)="onFocusOut()">
  <ng-content></ng-content>
</div>

<!-- Evento ngSubmit para formularios reactivos -->
<form [formGroup]="formularioLogin" (ngSubmit)="onSubmit()" novalidate>
  <!-- campos del formulario -->
  <app-button type="submit">Iniciar Sesión</app-button>
</form>
```

#### 2. Eventos personalizados

Se utilizan `@Output()` con `EventEmitter` para crear eventos personalizados que comunican acciones específicas del dominio:

- **`cerrar`**: Cierre de alertas, modales o modal de reserva
- **`checkedChange`**: Cambio de estado en checkboxes personalizados
- **`themeChanged`**: Cambio entre modo claro/oscuro
- **`menuToggled`**: Apertura/cierre del menú móvil
- **`cierre`**: Cierre de modal genérico
- **`guardar`**: Guardado de datos en modal de reserva
- **`editar`**: Emisión de evento de edición en tarjeta (card)
- **`eliminar`**: Emisión de evento de eliminación en tarjeta (card)
- **`itemToggled`**: Toggle de item en acordeón

#### 3. Eventos de Angular (formularios reactivos)

- **`ngSubmit`**: Emisión de evento cuando se envía un formulario reactivo (usado con [formGroup])

**Ejemplo de emisión de evento personalizado:**

```typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html'
})
export class Alert {
  @Output() cerrar = new EventEmitter<void>();

  alCerrar(): void {
    this.cerrar.emit();
  }
}

// Ejemplo con card (tarjeta)
@Component({
  selector: 'app-card',
  templateUrl: './card.html'
})
export class Card {
  @Output() editar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<void>();

  onEditar(): void {
    this.editar.emit();
  }

  onEliminar(): void {
    this.eliminar.emit();
  }
}

// Ejemplo con modal-reserva
@Component({
  selector: 'app-modal-reserva',
  templateUrl: './modal-reserva.html'
})
export class ModalReserva {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  onCerrar(): void {
    this.cerrar.emit();
  }

  onGuardar(): void {
    if (this.formulario.valid) {
      this.guardar.emit(this.formulario.value);
    }
  }
}

// Ejemplo con @HostListener para eventos globales
@Component({
  selector: 'app-modal',
  templateUrl: './modal.html'
})
export class Modal {
  @Output() cierre = new EventEmitter<void>();

  // Escucha la tecla Escape a nivel de documento
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    event.preventDefault();
    this.cierre.emit();
  }
}
```

### Uso de HostListener

`@HostListener` permite escuchar eventos del host, del `document` o de la `window` desde la clase del componente. La sintaxis básica es `@HostListener('target:event', ['$event'])` donde `target` puede ser `window`, `document` o omitirse (escucha el elemento host).

Ejemplos:

```typescript
import { HostListener } from '@angular/core';

// Escuchar Escape a nivel de documento (cerrar modal)
@HostListener('document:keydown.escape', ['$event'])
onEscapeKey(event: KeyboardEvent): void {
   event.preventDefault();
   this.cierre.emit();
}

// Escuchar cambio de tamaño de la ventana
@HostListener('window:resize', ['$event'])
onResize(event: UIEvent): void {
   const width = (event.target as Window).innerWidth;
   this.handleResize(width);
}

// Escuchar scroll (document/window)
@HostListener('window:scroll', [])
onScroll(): void {
   const y = window.scrollY || document.documentElement.scrollTop;
   this.checkScrollPosition(y);
}
```

Buenas prácticas:

- Importar `HostListener` desde `@angular/core`.
- Usarlo para listeners globales (`window`/`document`); para eventos locales prefiera el template (`(click)`, `(input)`, ...).
- Mantener la lógica en métodos separados para facilitar tests.
- Evitar trabajo pesado en `scroll`/`resize`; usar `throttle`/`debounce` cuando sea necesario.

## Uso de ViewChild y ElementRef

`@ViewChild`, `@ViewChildren`, `@ContentChild` y `ElementRef` se usan para acceder a componentes hijos y referencias DOM desde la clase del componente. Son herramientas útiles, pero conviene seguir buenas prácticas para evitar acoplamientos innecesarios y riesgo de manipular el DOM directamente.

Principios básicos:

- **`@ViewChild` / `@ViewChildren`**: acceder a un componente o referencia del template. Use `static: true|false` según necesidad y lea valores en `ngAfterViewInit` si son dinámicos.
- **`ElementRef`**: referencia al elemento nativo (`nativeElement`). Preferir `Renderer2` para modificar el DOM cuando sea posible.
- **`@ContentChildren`**: acceder a nodos proyectados con `ng-content`.
- **Evitar** manipular `nativeElement` directamente salvo casos justificados (medidas, foco, integración con librerías externas).

Archivos donde aparecen en el proyecto (ejemplos y notas):

- **`frontend/src/app/directives/feather-icon.directive.ts`**: usa `ElementRef` e `Renderer2` para insertar/actualizar iconos SVG. Esto es correcto: el uso de `Renderer2` evita accesos directos y mantiene compatibilidad con plataformas.

- **`frontend/src/app/components/shared/tab/tab.ts`**: usa `@ViewChildren('pestana', { read: ElementRef }) elementosPestana!: QueryList<ElementRef>` para obtener referencias a las pestañas. Ideal para calcular anchos o desplazar scroll. Recuerde suscribirse a `elementosPestana.changes` si las pestañas son dinámicas.

- **`frontend/src/app/components/shared/form-checkbox/form-checkbox.ts`**: contiene `@ViewChild('checkboxInput', { static: false }) checkboxInput?: ElementRef<HTMLInputElement>` y `@ContentChildren('*', { read: ElementRef }) elementosProyectados?: QueryList<ElementRef>`. Use comprobaciones `if (this.checkboxInput)` antes de acceder y prefiera `this.renderer.setProperty(this.checkboxInput.nativeElement, 'checked', true)` para cambiar propiedades.

- **`frontend/src/app/pages/registro/registro.ts`** y **`frontend/src/app/pages/login/login.ts`**: usan `@ViewChild(RegistroForm) formulario?: RegistroForm` / `@ViewChild(LoginForm) formulario?: LoginForm` para llamar métodos del formulario hijo (p. ej. `submit()` o `validar()`). Es un uso válido cuando necesita coordinar acciones desde el padre; mantenga la API del componente hijo clara (métodos públicos bien definidos) para minimizar acoplamiento.

Ejemplos cortos:

```typescript
// Acceso seguro en ngAfterViewInit
@ViewChild('checkboxInput', { static: false }) checkboxInput?: ElementRef<HTMLInputElement>;

ngAfterViewInit(): void {
   if (this.checkboxInput) {
      // Preferir Renderer2
      this.renderer.setAttribute(this.checkboxInput.nativeElement, 'aria-checked', 'false');
   }
}

// Usando ViewChildren para medidas
@ViewChildren('pestana', { read: ElementRef }) pestanas!: QueryList<ElementRef>;

ngAfterViewInit(): void {
   this.calcularAnchos();
   this.pestanas.changes.subscribe(() => this.calcularAnchos());
}

private calcularAnchos(): void {
   this.pestanas.forEach(el => {
      const w = (el.nativeElement as HTMLElement).offsetWidth;
      // lógica
   });
}
```

Buenas prácticas resumidas:

- Comprobar existencia (`if (this.elem)`) antes de usar `nativeElement`.
- Preferir `Renderer2` para cambios (atributos, estilos, propiedades) en lugar de tocar `nativeElement` directamente.
- Leer referencias en `ngAfterViewInit` cuando sean parte de la vista renderizada.
- Suscribirse a `QueryList.changes` si la lista de elementos puede cambiar dinámicamente.
- Mantener la API pública de componentes hijos para que los padres llamen métodos claros en lugar de manipular internals.

Referencias de código en el repositorio:

- [frontend/src/app/directives/feather-icon.directive.ts](frontend/src/app/directives/feather-icon.directive.ts#L1-L120)
- [frontend/src/app/components/shared/tab/tab.ts](frontend/src/app/components/shared/tab/tab.ts#L1-L120)
- [frontend/src/app/components/shared/form-checkbox/form-checkbox.ts](frontend/src/app/components/shared/form-checkbox/form-checkbox.ts#L1-L140)
- [frontend/src/app/pages/registro/registro.ts](frontend/src/app/pages/registro/registro.ts#L1-L40)
- [frontend/src/app/pages/login/login.ts](frontend/src/app/pages/login/login.ts#L1-L40)


**Ejemplo de escucha de evento personalizado:**

```html
<app-alert 
  tipo="exito" 
  (cerrar)="manejarCierre()"
>
  Operación completada con éxito
</app-alert>

<!-- Card con eventos de edición y eliminación -->
<app-card
  [titulo]="recurso.nombre"
  [descripcion]="recurso.descripcion"
  (editar)="editarRecurso(recurso.id)"
  (eliminar)="eliminarRecurso(recurso.id)">
</app-card>

<!-- Modal de reserva con eventos de cierre y guardado -->
<app-modal-reserva
  [abierto]="modalAbierto"
  [recurso]="recursoSeleccionado"
  (cerrar)="cerrarModal()"
  (guardar)="guardarReserva($event)">
</app-modal-reserva>

<!-- Accordion item con evento de toggle -->
<app-accordion-item
  [titulo]="'Configuración avanzada'"
  [abierto]="seccionAbierta"
  (itemToggled)="onToggleSeccion()">
  Contenido del acordeón
</app-accordion-item>
```

```typescript
manejarCierre(): void {
  console.log('Alerta cerrada por el usuario');
  // Lógica adicional...
}

editarRecurso(id: number): void {
  console.log('Editando recurso:', id);
  this.router.navigate(['/recursos', id, 'editar']);
}

eliminarRecurso(id: number): void {
  console.log('Eliminando recurso:', id);
  this.recursoService.eliminar(id).subscribe({
    next: () => this.notificarExito('Recurso eliminado'),
    error: (err) => this.notificarError('Error al eliminar')
  });
}

guardarReserva(datos: any): void {
  console.log('Guardando reserva:', datos);
  this.reservaService.crear(datos).subscribe({
    next: () => {
      this.cerrarModal();
      this.cargarReservas();
    }
  });
}

onToggleSeccion(): void {
  this.seccionAbierta = !this.seccionAbierta;
  console.log('Sección toggled:', this.seccionAbierta);
}
```

### Propagación de eventos

#### Comunicación padre -> hijo

Se utilizan `@Input()` para pasar datos y configuración desde componentes padre a hijos:

```typescript
// Componente hijo
@Input() tipo: 'exito' | 'error' | 'advertencia' | 'informacion' = 'informacion';
@Input() cerrable: boolean = false;
```

```html
<!-- Componente padre -->
<app-alert tipo="exito" [cerrable]="true">
  Registro completado
</app-alert>
```

#### Comunicación hijo -> padre

Se utilizan `@Output()` con `EventEmitter` para notificar al padre sobre acciones:

```typescript
// Componente hijo (form-checkbox)
@Output() checkedChange = new EventEmitter<boolean>();

onNativeChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  this.checked = target.checked;
  this.checkedChange.emit(this.checked);
}
```

```html
<!-- Componente padre -->
<app-form-checkbox 
  [checked]="recordarme"
  (checkedChange)="recordarme = $event"
>
  Recordarme
</app-form-checkbox>
```

#### Gestión de estado local

Para eventos que afectan al estado global de la aplicación (como el tema), se utiliza:

- **`localStorage`**: Persistencia del estado entre sesiones
- **Propiedades de clase**: Estado reactivo en el componente
- **Clases CSS en `documentElement`**: Aplicación inmediata de estilos

**Ejemplo - Cambio de tema:**

```typescript
alternarTema(): void {
  const esAhoraOscuro = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', esAhoraOscuro ? 'dark' : 'light');
  this.actualizarIcono();
}

ngOnInit(): void {
  const temaAlmacenado = localStorage.getItem('theme');
  if (temaAlmacenado === 'dark') {
    document.documentElement.classList.add('dark');
  }
  this.actualizarIcono();
}
```

### Principios y patrones

#### 1. Evitar efectos colaterales

Los manejadores de eventos son funciones puras que:
- No modifican parámetros de entrada
- Producen resultados predecibles
- Mantienen la lógica aislada y testeable

#### 2. Patrón de validación reactiva

Se utiliza `ReactiveFormsModule` de Angular para validación basada en observables.

#### 3. Encapsulamiento de lógica de eventos

Cada componente gestiona sus propios eventos sin dependencias externas.

### Ejemplos de flujos de eventos complejos

#### Flujo: Validación de formulario con eventos encadenados

```typescript
// 1. Usuario escribe en el campo email
// Template: <input (input)="onInput($event)" (blur)="onBlur()" />

onInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  // 2. Se actualiza el valor del control
  this.control?.setValue(target.value);
  // 3. Se ejecutan validadores síncronos
  // 4. Se ejecutan validadores asíncronos (si aplica)
}

onBlur(): void {
  // 5. Usuario sale del campo
  this.control?.markAsTouched();
  // 6. Se recalcula el estado de validación
  const estado = this.getValidationState('email');
  // 7. Se actualiza la UI con el estado correspondiente
}
```

#### Flujo: Click en botón -> Petición API -> Notificación UI

```typescript
// 1. Usuario hace clic en botón de Google
// Template: <app-button (click)="onGoogleLogin()">Continuar con Google</app-button>

onGoogleLogin(): void {
  // 2. Se emite evento de inicio de autenticación
  console.log('Iniciando autenticación con Google');
  
  // 3. Se llamaría al servicio de autenticación (ejemplo)
  // this.authService.loginWithGoogle().subscribe({
  //   next: (response) => {
  //     // 4. Éxito: se muestra notificación
  //     this.mostrarAlerta('exito', 'Sesión iniciada correctamente');
  //     // 5. Se navega al dashboard
  //     this.router.navigate(['/dashboard']);
  //   },
  //   error: (error) => {
  //     // 4. Error: se muestra alerta de error
  //     this.mostrarAlerta('error', 'Error al iniciar sesión');
  //   }
  // });
}
```

#### Flujo: Cambio de tema

```typescript
// 1. Usuario hace clic en botón de tema
// Template: <button (click)="alternarTema()">

alternarTema(): void {
  // 2. Se alterna la clase CSS en el documento
  const esAhoraOscuro = document.documentElement.classList.toggle('dark');
  
  // 3. Se persiste la preferencia en localStorage
  localStorage.setItem('theme', esAhoraOscuro ? 'dark' : 'light');
  
  // 4. Se actualiza el icono del botón
  this.actualizarIcono();
  // 5. Los estilos CSS se aplican automáticamente vía variables CSS
}

private actualizarIcono(): void {
  const esModoOscuro = document.documentElement.classList.contains('dark');
  this.modoIcon = esModoOscuro ? 'moon' : 'sun';
  this.modoTitle = esModoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  // 6. Angular detecta el cambio y actualiza la vista
}
```


### Diagrama de flujo de eventos principales

#### Flujo 1: Autenticación (Login)

```
1. Usuario rellena formulario de login
   ↓
2. (input) → onInput() → actualiza FormControl
   ↓
3. (blur) → onBlur() → marca campo como touched
   ↓
4. getValidationState() calcula estado (inicial/advertencia/error/éxito)
   ↓
5. UI muestra feedback visual (borde + mensaje)
   ↓
6. Usuario hace clic en "Iniciar sesión"
   ↓
7. (click) → onSubmit() → valida formulario completo
   ↓
8. Si válido: authService.login()
   ├─ Éxito → router.navigate(['/dashboard'])
   │         + mostrar alerta de éxito
   └─ Error → mostrar alerta de error
```

#### Flujo 2: Cambio de tema

```
1. Usuario hace clic en botón de tema (sol/luna)
   ↓
2. (click) → alternarTema()
   ↓
3. document.documentElement.classList.toggle('dark')
   ↓
4. localStorage.setItem('theme', 'dark'|'light')
   ↓
5. actualizarIcono() → cambia modoIcon y modoTitle
   ↓
6. Angular detecta cambio y actualiza vista
   ↓
7. CSS aplica variables de tema automáticamente
   (--fondo, --texto, --primario, etc.)
```

#### Flujo 3: Validación asíncrona de email (Registro)

```
1. Usuario escribe email en formulario de registro
   ↓
2. (input) → onInput() → actualiza FormControl
   ↓
3. Validador síncrono: validarEmailConTLD()
   ├─ Válido → continúa
   └─ Inválido → retorna error 'emailInvalidoTLD'
   ↓
4. Validador asíncrono: validadoresAsincronos.correoUnico()
   ↓
5. HTTP request → backend verifica si email existe
   ↓
6. Observable responde:
   ├─ Email disponible → control.valid = true
   │                    → estado = 'exito'
   │                    → mensaje: "El correo electrónico es correcto"
   └─ Email ya existe → control.errors = {emailTomado: true}
                       → estado = 'error'
                       → mensaje: "Este correo electrónico ya está registrado"
   ↓
7. UI actualiza borde y mensaje según estado
```

#### Flujo 4: Toggle de menú móvil

```
1. Usuario hace clic en icono hamburguesa
   ↓
2. (click) → toggleMenu()
   ↓
3. menuAbierto = !menuAbierto
   ↓
4. [class.cabecera__menu--abierto]="menuAbierto" se actualiza
   ↓
5. CSS aplica transformación y visibilidad
   ↓
6. Usuario hace clic en enlace del menú
   ↓
7. (click) → menuAbierto = false
   ↓
8. routerLink navega a la ruta
   ↓
9. Menú se cierra automáticamente
```

#### Flujo 5: Checkbox personalizado con evento custom

```
1. Usuario hace clic en checkbox visual
   ↓
2. (click) → onVisualClick($event)
   ↓
3. event.preventDefault() (evita doble toggle)
   ↓
4. Verifica: if (!this.desactivado)
   ↓
5. this.checked = !this.checked
   ↓
6. this.checkedChange.emit(this.checked)
   ↓
7. Componente padre recibe evento:
   (checkedChange)="recordarme = $event"
   ↓
8. Se actualiza estado en el padre
   ↓
9. [checked]="recordarme" actualiza hijo si es necesario
```

#### Flujo 6: Tooltip con mouseenter/mouseleave

```
1. Usuario mueve el cursor sobre un elemento con tooltip
   ↓
2. (mouseenter) → onMouseEnter()
   ↓
3. Inicia temporizador (setTimeout 200ms)
   ↓
4. Si el cursor permanece: mostrarTooltip = true
   ↓
5. Angular actualiza vista y muestra tooltip
   ↓
6. Usuario mueve el cursor fuera del elemento
   ↓
7. (mouseleave) → onMouseLeave()
   ↓
8. Cancela temporizador (clearTimeout)
   ↓
9. mostrarTooltip = false
   ↓
10. Tooltip se oculta
```

#### Flujo 7: Navegación por teclado en tabs

```
1. Usuario presiona Tab y enfoca un botón de tab
   ↓
2. (keydown) → manejarTecla($event)
   ↓
3. Detecta tecla: ArrowRight / ArrowLeft / Home / End
   ↓
4. Según la tecla:
   ├─ ArrowRight → activar siguiente tab
   ├─ ArrowLeft → activar tab anterior
   ├─ Home → activar primer tab
   └─ End → activar último tab
   ↓
5. event.preventDefault() (evita scroll)
   ↓
6. Actualiza tabActivo con nuevo índice
   ↓
7. Enfoca el nuevo botón de tab
   ↓
8. Angular actualiza vista mostrando contenido del tab activo
```

#### Flujo 8: Card con acciones (editar/eliminar)

```
1. Usuario visualiza una tarjeta (card) con recurso
   ↓
2. Usuario hace clic en botón "Editar"
   ↓
3. (click) → onEditar()
   ↓
4. this.editar.emit()
   ↓
5. Componente padre recibe: (editar)="editarRecurso(recurso.id)"
   ↓
6. Navega a formulario de edición
   ↓
ALTERNATIVA: Usuario hace clic en "Eliminar"
   ↓
7. (click) → onEliminar()
   ↓
8. this.eliminar.emit()
   ↓
9. Componente padre recibe: (eliminar)="eliminarRecurso(recurso.id)"
   ↓
10. Muestra modal de confirmación
   ↓
11. Si confirma: llamada API DELETE
   ↓
12. Actualiza lista de recursos
```

#### Flujo 9: Modal de reserva

```
1. Usuario hace clic en "Nueva reserva"
   ↓
2. Padre establece: modalAbierto = true
   ↓
3. Modal se renderiza con backdrop
   ↓
4. Usuario rellena formulario de reserva
   ↓
5. Usuario hace clic en "Guardar"
   ↓
6. (click) → onGuardar()
   ↓
7. Valida formulario
   ↓
8. Si válido: this.guardar.emit(this.formulario.value)
   ↓
9. Padre recibe: (guardar)="guardarReserva($event)"
   ↓
10. Llamada API POST para crear reserva
   ↓
11. Si éxito: cierra modal y recarga lista
   ↓
ALTERNATIVA: Usuario hace clic en botón cerrar o backdrop
   ↓
12. (click) → onCerrar() o onClickFondo($event)
   ↓
13. this.cerrar.emit()
   ↓
14. Padre recibe: (cerrar)="cerrarModal()"
   ↓
15. modalAbierto = false
```

#### Flujo 10: Accordion (acordeón)

```
1. Usuario visualiza item de acordeón cerrado
   ↓
2. (click) → toggle()
   ↓
3. Verifica si está desactivado
   ↓
4. Si no: abierto = !abierto
   ↓
5. this.itemToggled.emit()
   ↓
6. Componente padre recibe: (itemToggled)="onToggleSeccion()"
   ↓
7. Padre puede cerrar otros items (accordion único)
   ↓
8. Angular actualiza vista con animación
   ↓
9. Contenido se expande/colapsa
   ↓
10. Icono cambia (chevron-down / chevron-up)
```

### Compatibilidad de eventos en navegadores

| Evento | Chrome | Firefox | Safari | Edge | Chrome Android | Safari iOS | Notas |
|--------|--------|---------|--------|------|----------------|------------|-------|
| **click** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal desde IE9+ |
| **input** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte completo desde Chrome 1+ |
| **change** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal |
| **blur** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal |
| **focus** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal |
| **submit** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal |
| **keyup** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal |
| **keydown** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Usado para navegación por teclado en tabs |
| **keydown.escape** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Detección específica con @HostListener |
| **mouseenter** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | N/A | N/A | No bubbles, ideal para tooltips |
| **mouseleave** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | N/A | N/A | No bubbles, ideal para tooltips |
| **focusin** | ✅ Sí | ✅ Sí (52+) | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Bubbles, para tooltips accesibles |
| **focusout** | ✅ Sí | ✅ Sí (52+) | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Bubbles, para tooltips accesibles |
| **scroll** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ⚠️ Parcial | En iOS requiere `-webkit-overflow-scrolling: touch` para scroll suave |
| **pointerdown** | ✅ Sí (55+) | ✅ Sí (59+) | ✅ Sí (13+) | ✅ Sí | ✅ Sí (55+) | ✅ Sí (13+) | Reemplaza mousedown/touchstart |
| **pointerup** | ✅ Sí (55+) | ✅ Sí (59+) | ✅ Sí (13+) | ✅ Sí | ✅ Sí (55+) | ✅ Sí (13+) | Reemplaza mouseup/touchend |
| **pointermove** | ✅ Sí (55+) | ✅ Sí (59+) | ✅ Sí (13+) | ✅ Sí | ✅ Sí (55+) | ✅ Sí (13+) | Mejor para gestos multi-touch |
| **beforeunload** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ⚠️ Parcial | Safari iOS no muestra diálogo personalizado |
| **wheel** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Reemplaza mousewheel (deprecado) |
| **paste** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Clipboard API soportado desde Safari 13.1+ |
| **copy** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Clipboard API |
| **cut** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Clipboard API |


### Referencias

- [MDN Web Docs - Event Reference](https://developer.mozilla.org/es/docs/Web/Events)
- [Can I Use - Browser compatibility tables](https://caniuse.com/)
- [Angular Event Binding](https://angular.dev/guide/templates/event-listeners)
- [Web Pointer Events](https://www.w3.org/TR/pointerevents/)
