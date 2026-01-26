import { TipoRegla } from './backend-types';

// Datos para crear una regla de recurso
export interface ReglaRecursoRequest {
  tipoRegla: TipoRegla;
  valor: string;
  descripcion?: string;
  recursoId: number;
  miembroId: number;
}
