export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub: string;
  roles: { authority: string }[];
  exp: number;
  iat: number;
  id?: number | null;
}
