import { TipoRegla } from './backend-types';

// Update parcial de regla de recurso
export interface ReglaRecursoUpdate {
  tipoRegla?: TipoRegla;
  valor?: string;
  descripcion?: string;
}
