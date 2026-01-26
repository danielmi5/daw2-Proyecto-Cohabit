// Tipo para representar roles de miembros dentro de un grupo
// Ejemplo: 'ADMIN', 'MIEMBRO', etc.
export type RolGrupo = string;

// Tipo enumerado para categorías de recursos
export type TipoRecurso = "OBJETO" | "ESPACIO" | "SERVICIO" | "OTRO";

// Tipo para representar estados de recursos
// Ejemplo: 'DISPONIBLE', 'EN_USO', 'MANTENIMIENTO', etc.
export type EstadoRecurso = string;

// Tipo para representar tipos de reglas aplicables a recursos
// Ejemplo: 'CAPACIDAD_MAXIMA', 'HORARIO', 'RESTRICCION', etc.
export type TipoRegla = string;

// Tipo para representar estados de reservas
// Ejemplo: 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', etc.
export type EstadoReserva = string;

// Interfaz genérica para respuestas paginadas del backend
// @template T - Tipo de los elementos de la página
export interface BackendPage<T> {
	content: T[];
	totalElements: number; // Total de elementos (todas las páginas)
}
