import { RolGrupo } from './backend-types';

export interface MiembroGrupoRequest {
  usuarioId: number;
  grupoId: number;
  rol?: RolGrupo;
  activo?: boolean;
}
