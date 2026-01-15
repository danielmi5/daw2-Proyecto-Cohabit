import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeSwitcherService{
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDarkSubject.asObservable();

  private mediaQuery?: MediaQueryList;
  private mediaQueryHandler?: (e: MediaQueryListEvent) => void;

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

  alternarTema(): void {
    const esAhoraModoOscuro = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', esAhoraModoOscuro ? 'dark' : 'light');
    this.isDarkSubject.next(esAhoraModoOscuro);
  }
}
