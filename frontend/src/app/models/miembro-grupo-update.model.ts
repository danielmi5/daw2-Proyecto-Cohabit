import { RolGrupo } from './backend-types';

// Update parcial de miembro de grupo
export interface MiembroGrupoUpdate {
  rol?: RolGrupo;
  activo?: boolean;
}
