import { TipoRegla } from './backend-types';

export interface ReglaRecursoUpdate {
  tipoRegla?: TipoRegla;
  valor?: string;
  descripcion?: string;
}
