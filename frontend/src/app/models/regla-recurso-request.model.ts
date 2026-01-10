import { TipoRegla } from './backend-types';

export interface ReglaRecursoRequest {
  tipoRegla: TipoRegla;
  valor: string;
  descripcion?: string;
  recursoId: number;
  miembroId: number;
}
