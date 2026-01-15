import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService, Miga } from '../../../services/breadcrumb.service';

/**
 * Componente de migas de pan (breadcrumbs)
 * 
 * Muestra la ruta de navegación actual con enlaces navegables.
 * Se actualiza automáticamente al cambiar de ruta.
 * 
 * Características:
 * - Construcción dinámica basada en la configuración de rutas
 * - Enlaces navegables a cada nivel (excepto el último)
 * - Separadores visuales entre migas
 * - Estilo adaptable con clases CSS personalizables
 * 
 * Uso:
 * ```html
 * <app-breadcrumb />
 * ```
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss']
})
export class Breadcrumb {
  private breadcrumbService = inject(BreadcrumbService);

  /**
   * Signal con las migas de pan actuales
   */
  migas = this.breadcrumbService.migas;

  /**
   * Obtiene el índice de una miga en el array
   */
  obtenerIndice(miga: Miga): number {
    return this.migas().indexOf(miga);
  }
}
