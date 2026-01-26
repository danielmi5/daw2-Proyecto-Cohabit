import { EstadoReserva } from './backend-types';

// Datos para crear una reserva
export interface ReservaRequest {
  fecha: string; // Formato ISO 8601 o YYYY-MM-DD
  horaInicio: string; // Formato HH:mm
  horaFin: string; // Formato HH:mm
  notas?: string;
  numPersonas?: number;
  estado: EstadoReserva;
  miembroGrupoId: number;
  recursoId: number;
}
