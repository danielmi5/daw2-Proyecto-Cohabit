import { TipoRegla } from './backend-types';

export interface ReglaRecursoResponse {
  id?: number;
  tipoRegla?: TipoRegla;
  valor?: string;
  descripcion?: string;
  recursoId?: number;
  miembroCreadorId?: number;
  numero?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
