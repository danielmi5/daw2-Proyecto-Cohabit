import { Injectable, signal } from '@angular/core';

/**
 * Interfaz para representar una notificación de usuario
 */
export interface Notificacion {
  /**
   * Identificador único de la notificación
   */
  id: number;
  
  /**
   * Tipo de notificación que determina el estilo visual
   */
  type: 'exito' | 'error' | 'warning' | 'info';
  
  /**
   * Mensaje a mostrar al usuario
   */
  mensaje: string;
}

/**
 * Servicio para gestionar notificaciones toast (mensajes emergentes).
 * Utiliza signals para estado reactivo y auto-eliminación temporal.
 * 
 * @remarks
 * Características:
 * - Auto-eliminación después de 5 segundos
 * - Prevención de notificaciones duplicadas
 * - Reemplazo automático de notificaciones del mismo tipo
 * - Cuatro tipos de notificación: exito, error, warning, info
 * 
 * @example
 * ```typescript
 * notificacionService.success('Guardado correctamente');
 * notificacionService.error('Error al cargar datos');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  /**
   * Contador incremental para IDs únicos
   * @private
   */
  private contadorId = 0;
  
  /**
   * Signal de solo lectura con el array de notificaciones activas
   * @readonly
   * @public
   */
  readonly notificaciones = signal<Notificacion[]>([]);

  /**
   * Muestra una notificación del tipo especificado
   * @param type - Tipo de notificación
   * @param mensaje - Mensaje a mostrar
   * @private
   */
  private mostrar(type: Notificacion['type'], mensaje: string): void {
    const notificacion: Notificacion = {
      id: this.contadorId++,
      type,
      mensaje
    };

    // Evita duplicados
    // Si ya existe una notificación del mismo tipo y mensaje, no se añade.
    // Si existe una notificación del mismo tipo pero con mensaje distinto, eliminarla y añadir la nueva.
    this.notificaciones.update(actual => {
      if (actual.some(n => n.type === type && n.mensaje === mensaje)) return actual;
      const sinMismoTipo = actual.filter(n => n.type !== type);
      return sinMismoTipo.concat(notificacion);
    });

    // Se auto elimina después de 5 segundos
    setTimeout(() => this.eliminar(notificacion.id), 5000);
  }

  /**
   * Elimina una notificación por su ID
   * @param id - ID de la notificación a eliminar
   * @public
   */
  eliminar(id: number): void {
    this.notificaciones.update(actual => actual.filter(n => n.id !== id));
  }

  /**
   * Muestra una notificación de éxito
   * @param mensaje - Mensaje de éxito a mostrar
   * @public
   */
  success(mensaje: string): void {
    this.mostrar('exito', mensaje);
  }

  /**
   * Muestra una notificación de error
   * @param mensaje - Mensaje de error a mostrar
   * @public
   */
  error(mensaje: string): void {
    this.mostrar('error', mensaje);
  }

  /**
   * Muestra una notificación de advertencia
   * @param mensaje - Mensaje de advertencia a mostrar
   * @public
   */
  warning(mensaje: string): void {
    this.mostrar('warning', mensaje);
  }

  /**
   * Muestra una notificación informativa
   * @param mensaje - Mensaje informativo a mostrar
   * @public
   */
  info(mensaje: string): void {
    this.mostrar('info', mensaje);
  }
}
