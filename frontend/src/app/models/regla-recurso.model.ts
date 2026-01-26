import { TipoRegla } from './backend-types';

// Respuesta con datos de una regla de recurso
export interface ReglaRecursoResponse {
  id?: number;
  tipoRegla?: TipoRegla;
  valor?: string;
  descripcion?: string;
  recursoId?: number;
  miembroCreadorId?: number;
  numero?: number;
  fechaCreacion?: string; // ISO 8601
  fechaActualizacion?: string; // ISO 8601
}
