export interface GrupoResponse {
  id?: number;
  nombre?: string;
  direccion?: string;
  descripcion?: string;
  fotoGrupo?: string;
  codigoInvitacion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  miembrosIds?: number[];
  recursosIds?: number[];
  creadorId?: number;
}
