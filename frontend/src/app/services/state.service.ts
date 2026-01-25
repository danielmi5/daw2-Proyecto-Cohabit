import { Injectable, signal } from '@angular/core';

/**
 * Servicio central de gestión de estado reactivo.
 * Proporciona signals para notificar cambios en entidades principales
 * y permite actualizaciones cross-view sin necesidad de recargas.
 * 
 * Patrón: Signal-based state management
 * - Fuente de verdad única
 * - Actualización reactiva automática
 * - Sin dependencias externas (NgRx)
 */
@Injectable({ providedIn: 'root' })
export class StateService {
  /**
   * Triggers de cambio para cada entidad.
   * Cuando se incrementan, los componentes suscritos se actualizan automáticamente.
   */
  private readonly _recursosTrigger = signal(0);
  private readonly _reservasTrigger = signal(0);
  private readonly _gruposTrigger = signal(0);
  private readonly _miembrosTrigger = signal(0);

  // Signals públicos readonly
  readonly recursosTrigger = this._recursosTrigger.asReadonly();
  readonly reservasTrigger = this._reservasTrigger.asReadonly();
  readonly gruposTrigger = this._gruposTrigger.asReadonly();
  readonly miembrosTrigger = this._miembrosTrigger.asReadonly();

  /**
   * Notifica que los recursos han cambiado (create/update/delete)
   */
  notifyRecursosChanged(): void {
    this._recursosTrigger.update(v => v + 1);
  }

  /**
   * Notifica que las reservas han cambiado (create/update/delete)
   */
  notifyReservasChanged(): void {
    this._reservasTrigger.update(v => v + 1);
  }

  /**
   * Notifica que los grupos han cambiado (create/update/delete)
   */
  notifyGruposChanged(): void {
    this._gruposTrigger.update(v => v + 1);
  }

  /**
   * Notifica que los miembros han cambiado (create/update/delete)
   */
  notifyMiembrosChanged(): void {
    this._miembrosTrigger.update(v => v + 1);
  }
}
