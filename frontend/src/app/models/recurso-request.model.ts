import { TipoRecurso, EstadoRecurso } from './backend-types';

export interface RecursoRequest {
  nombre: string;
  descripcion?: string;
  fotoRecurso?: string;
  capacidad?: number;
  ubicacion?: string;
  tipo: TipoRecurso;
  estadoActual: EstadoRecurso;
  grupoId: number;
  creadorId: number;
}
