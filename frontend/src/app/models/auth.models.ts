// Interfaz para la petición de inicio de sesión
export interface LoginRequest {
  email: string;
  password: string;
}

// Interfaz para la petición de registro de nuevo usuario
export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
}

// Interfaz para la respuesta de autenticación exitosa
export interface AuthResponse {
  token: string; // Token JWT
}

// Token JWT decodificado
export interface DecodedToken {
  sub: string; // Email del usuario
  roles: { authority: string }[];
  exp: number; // Expiración (timestamp en segundos)
  iat: number; // Emisión (timestamp en segundos)
  id?: number | null;
}
