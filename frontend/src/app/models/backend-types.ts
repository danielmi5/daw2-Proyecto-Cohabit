export type RolGrupo = string;
export type TipoRecurso = "OBJETO" | "ESPACIO" | "SERVICIO" | "OTRO";
export type EstadoRecurso = string;
export type TipoRegla = string;
export type EstadoReserva = string;

export interface BackendPage<T> {
	content: T[];
	totalElements: number;
}
