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
```

#### 2. Eventos personalizados

Se utilizan `@Output()` con `EventEmitter` para crear eventos personalizados que comunican acciones específicas del dominio:

- **`cerrar`**: Cierre de alertas o modales
- **`checkedChange`**: Cambio de estado en checkboxes personalizados
- **`themeChanged`**: Cambio entre modo claro/oscuro
- **`menuToggled`**: Apertura/cierre del menú móvil

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
```

**Ejemplo de escucha de evento personalizado:**

```html
<app-alert 
  tipo="exito" 
  (cerrar)="manejarCierre()"
>
  Operación completada con éxito
</app-alert>
```

```typescript
manejarCierre(): void {
  console.log('Alerta cerrada por el usuario');
  // Lógica adicional...
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

### Compatibilidad de eventos en navegadores

| Evento | Chrome | Firefox | Safari | Edge | Chrome Android | Safari iOS | Notas |
|--------|--------|---------|--------|------|----------------|------------|-------|
| **click** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal desde IE9+ |
| **input** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte completo desde Chrome 1+ |
| **change** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal |
| **blur** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal |
| **focus** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal |
| **submit** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Soporte universal |
| **keyup** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | - |
| **keydown** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | - |
| **scroll** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ⚠️ Parcial | En iOS requiere `-webkit-overflow-scrolling: touch` para scroll suave |
| **pointerdown** | ✅ Sí (55+) | ✅ Sí (59+) | ✅ Sí (13+) | ✅ Sí | ✅ Sí (55+) | ✅ Sí (13+) | Reemplaza mousedown/touchstart |
| **pointerup** | ✅ Sí (55+) | ✅ Sí (59+) | ✅ Sí (13+) | ✅ Sí | ✅ Sí (55+) | ✅ Sí (13+) | Reemplaza mouseup/touchend |
| **pointermove** | ✅ Sí (55+) | ✅ Sí (59+) | ✅ Sí (13+) | ✅ Sí | ✅ Sí (55+) | ✅ Sí (13+) | Mejor para gestos multi-touch |
| **beforeunload** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ⚠️ Parcial | Safari iOS no muestra diálogo personalizado |
| **wheel** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Reemplaza mousewheel (deprecado) |
| **paste** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | Clipboard API soportado desde Safari 13.1+ |
| **copy** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | - |
| **cut** | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | ✅ Sí | - |


### Referencias

- [MDN Web Docs - Event Reference](https://developer.mozilla.org/es/docs/Web/Events)
- [Can I Use - Browser compatibility tables](https://caniuse.com/)
- [Angular Event Binding](https://angular.dev/guide/templates/event-listeners)
- [Web Pointer Events](https://www.w3.org/TR/pointerevents/)
