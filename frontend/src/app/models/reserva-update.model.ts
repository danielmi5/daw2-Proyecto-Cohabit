import { EstadoReserva } from './backend-types';

// Update parcial de una reserva
export interface ReservaUpdate {
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  notas?: string;
  numPersonas?: number;
  estado?: EstadoReserva;
}
