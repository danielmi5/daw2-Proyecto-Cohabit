import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface Miga {
  etiqueta: string;
  url: string;
}

/**
 * Servicio para gestionar los breadcrumbs (migas de pan) de la aplicación.
 * 
 * Construye dinámicamente las migas de pan basándose en:
 * - La configuración de rutas (propiedad data.breadcrumb)
 * - La jerarquía de rutas actual
 * - Los parámetros de ruta disponibles
 * 
 * Proporciona:
 * - migas: Signal de solo lectura con el array de migas actual
 * - Actualización automática al navegar
 */
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private _migas = signal<Miga[]>([]);
  
  /**
   * Signal de solo lectura con las migas de pan actuales
   */
  public migas = this._migas.asReadonly();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.inicializar();
  }

  /**
   * Inicializa el servicio escuchando los eventos de navegación
   */
  private inicializar(): void {
    // Construir migas al inicio
    this.construirMigas();

    // Reconstruir migas cada vez que se complete una navegación
    this.router.events
      .pipe(
        filter(evento => evento instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.construirMigas();
      });
  }

  /**
   * Construye las migas de pan basándose en la ruta actual y sus ancestros
   */
  private construirMigas(): void {
    const migas: Miga[] = [];
    let rutaActual = this.activatedRoute.root;
    let urlCompleta = '';

    // Recorrer el árbol de rutas desde la raíz hasta la hoja actual
    while (rutaActual) {
      // Si tiene hijos, procesamos el primer hijo
      if (rutaActual.firstChild) {
        rutaActual = rutaActual.firstChild;
        
        // Obtener el snapshot de la ruta para acceder a su configuración
        const snapshot = rutaActual.snapshot;
        
        // Obtiene la etiqueta del breadcrumb de la configuración de la ruta
        const etiquetaBreadcrumb = snapshot.data['breadcrumb'];
        
        // Maneja tanto rutas con segmentos como la ruta raíz ("")
        if (snapshot.url.length > 0) {
          const segmentoUrl = snapshot.url.map(segmento => segmento.path).join('/');
          urlCompleta += `/${segmentoUrl}`;
          
          if (etiquetaBreadcrumb) {
            migas.push({
              etiqueta: etiquetaBreadcrumb,
              url: urlCompleta
            });
          }
        } else if (etiquetaBreadcrumb && urlCompleta === '') {
          // Para la ruta raíz ("")
          migas.push({
            etiqueta: etiquetaBreadcrumb,
            url: '/'
          });
        }
      } else {
        // No hay más hijos, salir del bucle
        rutaActual = null as any;
      }
    }

    // Actualizar el signal con las nuevas migas
    this._migas.set(migas);
  }

  /**
   * Permite actualizar manualmente las migas de pan
   * (útil para casos especiales donde no se puede usar data en las rutas)
   */
  public establecerMigas(migas: Miga[]): void {
    this._migas.set(migas);
  }

  /**
   * Agrega una miga al final de la lista actual
   */
  public agregarMiga(miga: Miga): void {
    this._migas.update(migasActuales => [...migasActuales, miga]);
  }

  /**
   * Limpia todas las migas
   */
  public limpiarMigas(): void {
    this._migas.set([]);
  }
}
