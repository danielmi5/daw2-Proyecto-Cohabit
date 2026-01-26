import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ModalService } from '../services/modal.service';

/**
 * Guard funcional para confirmar la salida desde páginas de autenticación (login, registro).
 * Implementa la interfaz CanDeactivateFn de Angular Router.
 * 
 * @param component - Componente desde el cual se intenta salir
 * @returns Promise<boolean> o boolean indicando si se permite la navegación
 * 
 * @remarks
 * Comportamiento:
 * - Si el componente expone el método `hayCambiosAuth()` y retorna true, muestra modal de confirmación
 * - Si no hay cambios, permite la navegación directamente
 * - Utilizado como canDeactivate en rutas de autenticación para evitar pérdida de datos
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
