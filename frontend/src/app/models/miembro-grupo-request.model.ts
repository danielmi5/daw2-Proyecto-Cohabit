import { RolGrupo } from './backend-types';

// Datos para agregar un miembro a un grupo
export interface MiembroGrupoRequest {
  usuarioId: number;
  grupoId: number;
  rol?: RolGrupo;
  activo?: boolean;
}
