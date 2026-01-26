import { TipoRecurso, EstadoRecurso } from './backend-types';

// Respuesta con datos de un recurso compartido
export interface RecursoResponse {
  id?: number;
  nombre?: string;
  descripcion?: string;
  fotoRecurso?: string;
  capacidad?: number;
  ubicacion?: string;
  tipo?: TipoRecurso; // OBJETO, ESPACIO, SERVICIO, OTRO
  estadoActual?: EstadoRecurso;
  grupoId?: number;
  numero?: number; // Número correlativo dentro del grupo
  creadorId?: number;
  reservasIds?: number[];
  reglasIds?: number[];
  fechaCreacion?: string; // ISO 8601
  fechaActualizacion?: string; // ISO 8601
}
