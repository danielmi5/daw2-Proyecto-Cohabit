import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

/**
 * Guard funcional para proteger rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a la página de login.
 * Se utiliza canActivate
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.autenticado()) {
    return true;
  }

  // Si no está autenticado, redirige a login y guarda la URL a la que iba para redirigir después del login
  router.navigate(['login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};
