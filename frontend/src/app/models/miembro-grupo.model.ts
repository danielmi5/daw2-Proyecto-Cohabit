import { RolGrupo } from './backend-types';

export interface MiembroGrupoResponse {
  id?: number;
  usuarioId?: number;
  grupoId?: number;
  rol?: RolGrupo;
  fechaUnion?: string;
  recursosIds?: number[];
  reservasIds?: number[];
  activo?: boolean;
}
