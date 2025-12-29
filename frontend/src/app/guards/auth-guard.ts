import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ModalService } from "../services/modal.service";

/**
 * Guard funcional para proteger rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a la página de login.
 * Se utiliza canActivate
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const modalService = inject(ModalService);

  if (authService.autenticado()) return true;

  modalService.mostrarPedirAuth(state.url);
  return false;
};
