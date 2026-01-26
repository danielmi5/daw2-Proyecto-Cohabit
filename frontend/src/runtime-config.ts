// Configuración en tiempo de ejecución de la aplicación.
// Contiene variables de entorno que pueden ser modificadas sin recompilar.
//
// - La URL de la API puede ser sobrescrita mediante inyección en tiempo de despliegue
// - En producción, este archivo puede ser generado dinámicamente por el servidor
// - El valor por defecto apunta al backend desplegado en DigitalOcean
//
// Ejemplo:
// // Uso en servicios
// import { RUNTIME_CONFIG } from '../runtime-config';
// const apiUrl = RUNTIME_CONFIG.apiBaseUrl;
export const RUNTIME_CONFIG = {
  /**
   * URL base de la API REST del backend.
   * Por defecto apunta al entorno de producción.
   */
  apiBaseUrl: 'https://cohabit-backend-n6k7o.ondigitalocean.app'
};
