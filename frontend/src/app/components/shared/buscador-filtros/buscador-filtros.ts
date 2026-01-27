import { Component, Output, EventEmitter, Input, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { FormInput } from '../form-input/form-input';
import { FormSelect } from '../form-select/form-select';
import { Button } from '../button/button';
import { TipoRecurso, EstadoRecurso } from '../../../models/backend-types';

export interface FiltrosRecurso {
  busqueda: string;
  tipo: TipoRecurso | "";
  estado: EstadoRecurso | "";
}

// Buscador y filtros de recursos con debounce (300ms). Filtros: búsqueda texto, tipo, estado
@Component({
  selector: 'app-buscador-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule, FeatherIconDirective, FormInput, FormSelect, Button],
  templateUrl: './buscador-filtros.html',
  styleUrls: ['./buscador-filtros.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuscadorFiltros {
  @Input() mostrarFiltros: boolean = true;
  @Output() filtrosChange = new EventEmitter<FiltrosRecurso>();

  filtros: FiltrosRecurso = {
    busqueda: "",
    tipo: "",
    estado: ""
  };

  mostrarFiltrosAvanzados = false;

  // Signal con debounce 300ms para búsqueda
  private busquedaSignal = signal<string>("");
  private debounceTimer: any;

  constructor() {
    /**
     * Effect que implementa el debounce de 300ms para el campo de búsqueda.
     * 
     * @remarks
     * Cada vez que cambia `busquedaSignal`, espera 300ms antes de actualizar
     * el valor de `filtros.busqueda` y emitir el evento `filtrosChange`.
     * 
     * Esto evita múltiples llamadas al servidor durante la escritura rápida,
     * mejorando el rendimiento y la experiencia de usuario.
     */
    effect(() => {
      const busqueda = this.busquedaSignal();
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.filtros.busqueda = busqueda;
        this.emitirFiltros();
      }, 300);
    });
  }

  /**
   * Opciones de tipos de recurso para el selector desplegable.
   * 
   * @remarks
   * Incluye una opción vacía "Todos los tipos" y todas las opciones
   * del enum `TipoRecurso`.
   */
  tiposRecurso: { valor: TipoRecurso | "", etiqueta: string }[] = [
    { valor: "", etiqueta: "Todos los tipos" },
    { valor: "ESPACIO", etiqueta: "Espacio" },
    { valor: "OBJETO", etiqueta: "Objeto" },
    { valor: "SERVICIO", etiqueta: "Servicio" },
    { valor: "OTRO", etiqueta: "Otro" }
  ];

  /**
   * Opciones de estados de recurso para el selector desplegable.
   * 
   * @remarks
   * Incluye una opción vacía "Todos los estados" y todas las opciones
   * del enum `EstadoRecurso`.
   */
  estadosRecurso: { valor: EstadoRecurso | "", etiqueta: string }[] = [
    { valor: "", etiqueta: "Todos los estados" },
    { valor: "DISPONIBLE", etiqueta: "Disponible" },
    { valor: "OCUPADO", etiqueta: "Ocupado" },
    { valor: "EN_MANTENIMIENTO", etiqueta: "En mantenimiento" },
    { valor: "FUERA_DE_SERVICIO", etiqueta: "Fuera de servicio" }
  ];

  /**
   * Getter que convierte las opciones de tipos al formato requerido por `FormSelect`.
   * 
   * @returns Array de objetos con propiedades `value` y `label`.
   */
  get tiposOpciones(): Array<{ value: string; label: string }> {
    return this.tiposRecurso.map(t => ({ value: String(t.valor), label: t.etiqueta }));
  }

  /**
   * Getter que convierte las opciones de estados al formato requerido por `FormSelect`.
   * 
   * @returns Array de objetos con propiedades `value` y `label`.
   */
  get estadosOpciones(): Array<{ value: string; label: string }> {
    return this.estadosRecurso.map(e => ({ value: String(e.valor), label: e.etiqueta }));
  }

  /**
   * Maneja el cambio en el campo de búsqueda.
   * 
   * @remarks
   * Actualiza el signal `busquedaSignal`, que dispara el effect
   * con debounce para emitir el cambio después de 300ms.
   */
  onBusquedaChange(): void {
    // Actualiza el signal, el debounce se maneja en el effect
    this.busquedaSignal.set(this.filtros.busqueda);
  }

  /**
   * Maneja el cambio en los filtros de tipo y estado.
   * 
   * @remarks
   * Emite los filtros de forma inmediata sin debounce.
   */
  onFiltroChange(): void {
    this.emitirFiltros();
  }

  /**
   * Alterna la visibilidad del panel de filtros avanzados.
   * 
   * @remarks
   * Permite mostrar/ocultar los filtros de tipo y estado de forma colapsable.
   */
  toggleFiltrosAvanzados(): void {
    this.mostrarFiltrosAvanzados = !this.mostrarFiltrosAvanzados;
  }

  /**
   * Limpia todos los filtros aplicados y los restaura a sus valores por defecto.
   * 
   * @remarks
   * Restablece el campo de búsqueda, el tipo y el estado a valores vacíos,
   * y emite el evento `filtrosChange` con los filtros limpios.
   */
  limpiarFiltros(): void {
    this.filtros = {
      busqueda: "",
      tipo: "",
      estado: ""
    };
    this.emitirFiltros();
  }

  /**
   * Emite el evento `filtrosChange` con los valores actuales de los filtros.
   * 
   * @remarks
   * Método privado utilizado internamente para notificar cambios al componente padre.
   * 
   * @private
   */
  private emitirFiltros(): void {
    this.filtrosChange.emit({ ...this.filtros });
  }

  /**
   * Getter que indica si hay filtros activos (diferentes de los valores por defecto).
   * 
   * @returns `true` si al menos un filtro (tipo o estado) está activo, `false` en caso contrario.
   * 
   * @remarks
   * Útil para mostrar indicadores visuales o habilitar el botón de limpiar filtros.
   */
  get hayFiltrosActivos(): boolean {
    return this.filtros.tipo !== "" || this.filtros.estado !== "";
  }
}
