// Datos para crear un grupo
export interface GrupoRequest {
  nombre: string;
  direccion?: string;
  descripcion?: string;
  fotoGrupo?: string;
  creadorId: number;
}
