import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Servicio para gestionar el tema claro/oscuro de la aplicación.
 * Sincroniza el tema con localStorage y la preferencia del sistema operativo.
 * 
 * @remarks
 * Características:
 * - Persistencia en localStorage con clave 'theme'
 * - Detección automática de preferencia del sistema (prefers-color-scheme)
 * - Sincronización con cambios del sistema en tiempo real
 * - Observable reactivo del estado del tema
 * 
 * @example
 * ```typescript
 * // En el componente
 * themeSwitcher.init(); // Inicializar en AppComponent
 * themeSwitcher.alternarTema(); // Cambiar tema
 * themeSwitcher.isDark$.subscribe(isDark => console.log(isDark));
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ThemeSwitcherService{
  /**
   * BehaviorSubject que emite el estado actual del tema oscuro
   * @private
   */
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  
  /**
   * Observable del estado del tema oscuro
   * @public
   */
  isDark$ = this.isDarkSubject.asObservable();

  /**
   * MediaQueryList para detectar cambios en la preferencia del sistema
   * @private
   */
  private mediaQuery?: MediaQueryList;
  
  /**
   * Handler para eventos de cambio de preferencia del sistema
   * @private
   */
  private mediaQueryHandler?: (e: MediaQueryListEvent) => void;

  /**
   * Inicializa el servicio de tema.
   * Debe llamarse una vez al inicio de la aplicación (normalmente en AppComponent).
   * 
   * @remarks
   * Prioridad de detección:
   * 1. Tema guardado en localStorage
   * 2. Preferencia del sistema (prefers-color-scheme)
   * 3. Tema claro por defecto
   * 
   * @public
   */
  init(): void {
    const temaAlmacenado = localStorage.getItem('theme');
    const prefiereModoOscuro = typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (temaAlmacenado === 'dark') document.documentElement.classList.add('dark');
    else if (temaAlmacenado === 'light') document.documentElement.classList.remove('dark');
    else if (prefiereModoOscuro) document.documentElement.classList.add('dark');

    this.isDarkSubject.next(document.documentElement.classList.contains('dark'));

    // Registra listener para cambios en la preferencia del sistema
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQueryHandler = (e: MediaQueryListEvent) => {
        // Solo aplica el cambio si el usuario no tiene una preferencia guardada
        if (localStorage.getItem('theme')) return;
        const esModoOscuro = e.matches;
        if (esModoOscuro) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        this.isDarkSubject.next(esModoOscuro);
      };

      // Usa addEventListener si está disponible, si no, usa addListener por compatibilidad
      try {
        if (this.mediaQuery.addEventListener) {
          this.mediaQuery.addEventListener('change', this.mediaQueryHandler as EventListener);
        } else if ((this.mediaQuery as any).addListener) {
          (this.mediaQuery as any).addListener(this.mediaQueryHandler);
        }
      } catch (error) {
        console.warn('Error al registrar listener', error);
      }
    }
  }

  /**
   * Alterna entre tema claro y oscuro.
   * Guarda la preferencia en localStorage.
   * @public
   */
  alternarTema(): void {
    const esAhoraModoOscuro = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', esAhoraModoOscuro ? 'dark' : 'light');
    this.isDarkSubject.next(esAhoraModoOscuro);
  }
}
