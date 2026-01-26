import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ModalService } from "../services/modal.service";
import { RedireccionService } from "../services/redireccion.service";

/**
 * Guard funcional para proteger rutas que requieren autenticación.
 * Implementa la interfaz CanActivateFn de Angular Router.
 * 
 * @param route - Información de la ruta activada
 * @param state - Estado actual del router
 * @returns true si el usuario está autenticado, false en caso contrario
 * 
 * @remarks
 * Si el usuario no está autenticado:
 * - Guarda la URL actual para redirección posterior
 * - Muestra un modal solicitando autenticación
 * - Impide el acceso a la ruta
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const modalService = inject(ModalService);
  const redireccionService = inject(RedireccionService);

  if (authService.autenticado()) return true;

  // Guarda la URL en el servicio de redirección y mostrar modal
  redireccionService.setUrlAVolver(state.url);
  modalService.mostrarPedirAuth();
  return false;
};
