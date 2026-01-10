import { EstadoReserva } from './backend-types';

export interface ReservaResponse {
  id?: number;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  notas?: string;
  numPersonas?: number;
  estado?: EstadoReserva;
  miembroGrupoId?: number;
  recursoId?: number;
  numero?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
