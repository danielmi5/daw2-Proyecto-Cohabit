import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Resolver que garantiza que los datos del usuario autenticado estén cargados
 * antes de activar la ruta. Devuelve Observable<UsuarioResponse|null>.
 */
export const usuarioResolver: ResolveFn<any> = () => {
  const auth = inject(AuthService);
  return auth.cargarUsuarioDesdeToken();
};
