import { TipoRecurso, EstadoRecurso } from './backend-types';

export interface RecursoResponse {
  id?: number;
  nombre?: string;
  descripcion?: string;
  fotoRecurso?: string;
  capacidad?: number;
  ubicacion?: string;
  tipo?: TipoRecurso;
  estadoActual?: EstadoRecurso;
  grupoId?: number;
  numero?: number;
  creadorId?: number;
  reservasIds?: number[];
  reglasIds?: number[];
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
