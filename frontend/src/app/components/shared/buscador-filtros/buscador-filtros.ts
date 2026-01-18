import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { FormInput } from '../form-input/form-input';
import { FormSelect } from '../form-select/form-select';
import { Button } from '../button/button';
import { TipoRecurso, EstadoRecurso } from '../../../models/backend-types';

export interface FiltrosRecurso {
  busqueda: string;
  tipo: TipoRecurso | '';
  estado: EstadoRecurso | '';
}

@Component({
  selector: 'app-buscador-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule, FeatherIconDirective, FormInput, FormSelect, Button],
  templateUrl: './buscador-filtros.html',
  styleUrls: ['./buscador-filtros.scss'],
})
export class BuscadorFiltros {
  @Input() mostrarFiltros: boolean = true;
  @Output() filtrosChange = new EventEmitter<FiltrosRecurso>();

  filtros: FiltrosRecurso = {
    busqueda: '',
    tipo: '',
    estado: ''
  };

  mostrarFiltrosAvanzados = false;

  tiposRecurso: { valor: TipoRecurso | '', etiqueta: string }[] = [
    { valor: '', etiqueta: 'Todos los tipos' },
    { valor: 'SALA', etiqueta: 'Sala' },
    { valor: 'VEHICULO', etiqueta: 'Vehículo' },
    { valor: 'EQUIPO', etiqueta: 'Equipo' },
    { valor: 'OTRO', etiqueta: 'Otro' }
  ];

  estadosRecurso: { valor: EstadoRecurso | '', etiqueta: string }[] = [
    { valor: '', etiqueta: 'Todos los estados' },
    { valor: 'DISPONIBLE', etiqueta: 'Disponible' },
    { valor: 'OCUPADO', etiqueta: 'Ocupado' },
    { valor: 'EN_MANTENIMIENTO', etiqueta: 'En mantenimiento' },
    { valor: 'FUERA_DE_SERVICIO', etiqueta: 'Fuera de servicio' }
  ];

  // Opciones adaptadas para `app-form-select` (array { value, label })
  get tiposOpciones(): Array<{ value: string; label: string }> {
    return this.tiposRecurso.map(t => ({ value: String(t.valor), label: t.etiqueta }));
  }

  get estadosOpciones(): Array<{ value: string; label: string }> {
    return this.estadosRecurso.map(e => ({ value: String(e.valor), label: e.etiqueta }));
  }

  onBusquedaChange(): void {
    this.emitirFiltros();
  }

  onFiltroChange(): void {
    this.emitirFiltros();
  }

  toggleFiltrosAvanzados(): void {
    this.mostrarFiltrosAvanzados = !this.mostrarFiltrosAvanzados;
  }

  limpiarFiltros(): void {
    this.filtros = {
      busqueda: '',
      tipo: '',
      estado: ''
    };
    this.emitirFiltros();
  }

  private emitirFiltros(): void {
    this.filtrosChange.emit({ ...this.filtros });
  }

  get hayFiltrosActivos(): boolean {
    return this.filtros.tipo !== '' || this.filtros.estado !== '';
  }
}
