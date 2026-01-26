import { EstadoReserva } from './backend-types';

// Respuesta con datos de una reserva
export interface ReservaResponse {
  id?: number;
  fecha?: string; // ISO 8601 o YYYY-MM-DD
  horaInicio?: string; // HH:mm o HH:mm:ss
  horaFin?: string; // HH:mm o HH:mm:ss
  notas?: string;
  numPersonas?: number;
  estado?: EstadoReserva;
  miembroGrupoId?: number;
  recursoId?: number;
  numero?: number;
  fechaCreacion?: string; // ISO 8601
  fechaActualizacion?: string; // ISO 8601
}
