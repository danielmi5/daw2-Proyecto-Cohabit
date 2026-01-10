export interface UsuarioRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  fotoPerfil?: string;
  pais?: string;
  ciudad?: string;
  telefono?: string;
}
