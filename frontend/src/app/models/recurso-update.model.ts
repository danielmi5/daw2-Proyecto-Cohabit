import { TipoRecurso, EstadoRecurso } from './backend-types';

// Update parcial de un recurso
export interface RecursoUpdate {
  nombre?: string;
  descripcion?: string;
  fotoRecurso?: string;
  capacidad?: number;
  ubicacion?: string;
  tipo?: TipoRecurso;
  estadoActual?: EstadoRecurso;
}
