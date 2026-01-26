import { RolGrupo } from './backend-types';

// Respuesta con datos de miembro de grupo
export interface MiembroGrupoResponse {
  id?: number;
  usuarioId?: number;
  grupoId?: number;
  rol?: RolGrupo;
  fechaUnion?: string; // ISO 8601
  recursosIds?: number[];
  reservasIds?: number[];
  activo?: boolean;
}
