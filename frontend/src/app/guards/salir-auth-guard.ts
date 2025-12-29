import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ModalService } from '../services/modal.service';

/**
 * Guard funcional para confirmar la salida desde páginas de autenticación
 * (por ejemplo `login` y `registro`).
 *
 * - Si el componente de la página expone `hayCambiosAuth()` y devuelve true,
 *   se muestra un modal de confirmación llamando a `modalService.confirmarSalir()`.
 * - Si el formulario no tiene cambios, permite la navegación devolviendo true.
 *
 * Este guard se utiliza como `canDeactivate` en las rutas de autenticación.
 */
export const salirAuthGuard: CanDeactivateFn<unknown> = (component: any) => {
  const modalService = inject(ModalService);

  if (typeof (component as any).hayCambiosAuth === 'function') {
    const hay = (component as any).hayCambiosAuth();
    if (!hay) return true;
    return modalService.confirmarSalir();
  }

  return true;
};
