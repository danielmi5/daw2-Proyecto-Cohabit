// Interfaz genérica para respuestas de lista paginada de la API
// @template T - Tipo de los elementos de la lista
export interface ApiListResponse<T> {
  items: T[];
  total: number;
}
