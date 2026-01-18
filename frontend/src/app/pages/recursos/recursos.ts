import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardRecurso } from '../../components/shared/card-recurso/card-recurso';
import { BuscadorFiltros, FiltrosRecurso } from '../../components/shared/buscador-filtros/buscador-filtros';
import { Button } from '../../components/shared/button/button';
import { RecursoResponse } from '../../models';

@Component({
  selector: 'app-recursos',
  imports: [CommonModule, CardRecurso, BuscadorFiltros, Button],
  templateUrl: './recursos.html',
  styleUrl: './recursos.scss',
})
export class Recursos implements OnInit {
  recursos: RecursoResponse[] = [];
  recursosFiltrados: RecursoResponse[] = [];
  total = 0;
  loading = true;
  error = false;
  errorMessage = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarRecursos();
  }

  cargarRecursos(): void {
    // Simulación: cargar datos locales en memoria
    this.loading = true;
    this.error = false;

    const MOCK: RecursoResponse[] = [
      {
        id: 1,
        nombre: 'Sala de reuniones A',
        descripcion: 'Sala amplia con proyector y pizarra, Sala amplia con proyector y pizarra, Sala amplia con proyector y pizarra,Sala amplia con proyector y pizarra',
        fotoRecurso: '/public/img/recursos/sala-a.jpg',
        capacidad: 10,
        ubicacion: 'Planta 1',
        tipo: 'ESPACIO',
        estadoActual: 'DISPONIBLE',
        grupoId: 1,
        numero: 1
      },
      {
        id: 2,
        nombre: 'Proyector portátil',
        descripcion: 'Proyector LED para presentaciones',
        fotoRecurso: '/public/img/recursos/proyector.jpg',
        capacidad: 0,
        ubicacion: 'Almacén',
        tipo: 'OBJETO',
        estadoActual: 'EN_MANTENIMIENTO',
        grupoId: 1,
        numero: 2
      },
      {
        id: 3,
        nombre: 'Cocina común',
        descripcion: 'Cocina con microondas y nevera',
        fotoRecurso: undefined,
        capacidad: 6,
        ubicacion: 'Planta baja',
        tipo: 'ESPACIO',
        estadoActual: 'DISPONIBLE',
        grupoId: 1,
        numero: 1
      }
    ];

    // Asignar datos simulados
    this.recursos = MOCK;
    this.recursosFiltrados = [...this.recursos];
    this.total = this.recursos.length;
    this.loading = false;
  }

  onFiltrosChange(filtros: FiltrosRecurso): void {
    let resultados = [...this.recursos];

    if (filtros.busqueda.trim()) {
      const busquedaLower = filtros.busqueda.toLowerCase();
      resultados = resultados.filter(recurso =>
        recurso.nombre?.toLowerCase().includes(busquedaLower) ||
        recurso.descripcion?.toLowerCase().includes(busquedaLower) ||
        recurso.ubicacion?.toLowerCase().includes(busquedaLower)
      );
    }

    if (filtros.tipo) {
      resultados = resultados.filter(recurso => recurso.tipo === filtros.tipo);
    }

    if (filtros.estado) {
      resultados = resultados.filter(recurso => recurso.estadoActual === filtros.estado);
    }

    this.recursosFiltrados = resultados;
  }

  verRecurso(recurso: RecursoResponse): void {
    console.log('Ver recurso:', recurso);
  }

  editarRecurso(recurso: RecursoResponse): void {
    console.log('Editar recurso:', recurso);
  }

  eliminarRecurso(recurso: RecursoResponse): void {
    if (!recurso.id) return;

    if (confirm(`¿Estás seguro de que deseas eliminar el recurso "${recurso.nombre}"?`)) {
      // Simular eliminación en memoria
      this.recursos = this.recursos.filter(r => r.id !== recurso.id);
      this.recursosFiltrados = this.recursosFiltrados.filter(r => r.id !== recurso.id);
      this.total = this.recursos.length;
    }
  }

  crearRecurso(): void {
    // Simular creación rápida
    const nuevo: RecursoResponse = {
      id: (this.recursos.reduce((max, r) => Math.max(max, r.id || 0), 0) || 0) + 1,
      nombre: `Recurso ${this.total + 1}`,
      descripcion: 'Recurso creado en modo simulación',
      tipo: 'ESPACIO',
      estadoActual: 'DISPONIBLE',
      grupoId: 1
    };

    this.recursos.unshift(nuevo);
    this.recursosFiltrados = [...this.recursos];
    this.total = this.recursos.length;
  }

  retry(): void {
    this.cargarRecursos();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
