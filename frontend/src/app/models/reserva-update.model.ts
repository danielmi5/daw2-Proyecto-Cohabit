import { EstadoReserva } from './backend-types';

export interface ReservaUpdate {
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  notas?: string;
  numPersonas?: number;
  estado?: EstadoReserva;
}
