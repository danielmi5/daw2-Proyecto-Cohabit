// Respuesta con datos de un grupo
export interface GrupoResponse {
  id?: number;
  nombre?: string;
  direccion?: string;
  descripcion?: string;
  fotoGrupo?: string;
  codigoInvitacion?: string;
  fechaCreacion?: string; // ISO 8601
  fechaActualizacion?: string; // ISO 8601
  miembrosIds?: number[];
  recursosIds?: number[];
  creadorId?: number;
}
