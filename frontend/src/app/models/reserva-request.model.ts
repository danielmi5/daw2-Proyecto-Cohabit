import { EstadoReserva } from './backend-types';

export interface ReservaRequest {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  notas?: string;
  numPersonas?: number;
  estado: EstadoReserva;
  miembroGrupoId: number;
  recursoId: number;
}
