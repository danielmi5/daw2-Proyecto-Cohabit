// Respuesta con datos de un usuario
export interface UsuarioResponse {
  id?: number;
  nombre?: string;
  apellidos?: string;
  email?: string;
  fotoPerfil?: string;
  pais?: string;
  ciudad?: string;
  telefono?: string;
  fechaRegistro?: string; // ISO 8601
  miembroGrupoId?: number;
}
