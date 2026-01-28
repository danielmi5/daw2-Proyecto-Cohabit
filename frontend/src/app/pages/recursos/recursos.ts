import { Component, OnInit, inject, effect, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardRecurso } from '../../components/shared/card-recurso/card-recurso';
import { BuscadorFiltros, FiltrosRecurso } from '../../components/shared/buscador-filtros/buscador-filtros';
import { Button } from '../../components/shared/button/button';
import { ModalRecurso } from '../../components/shared/modal-recurso/modal-recurso';
import { Paginador } from '../../components/shared/paginador/paginador';
import { ScrollInfinitoDirective } from '../../directives/scroll-infinito.directive';
import { RecursoResponse, RecursoRequest, RecursoUpdate } from '../../models';
import { RecursoService } from '../../services/recurso.service';
import { GrupoService } from '../../services/grupo.service';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { MiembroGrupoService } from '../../services/miembro-grupo.service';
import { SubidaArchivosService } from '../../services/subida-archivos.service';
import { StateService } from '../../services/state.service';

/**
 * Estrategia de paginación a utilizar:
 * - 'scroll-infinito': Acumula resultados al hacer scroll
 * - 'paginador': Navegación clásica con números de página
 */
type EstrategiaPaginacion = 'scroll-infinito' | 'paginador';

// Página CRUD de recursos del grupo con búsqueda/filtrado y paginación
@Component({
  selector: 'app-recursos',
  imports: [CommonModule, CardRecurso, BuscadorFiltros, Button, ModalRecurso, Paginador, ScrollInfinitoDirective],
  templateUrl: './recursos.html',
  styleUrls: ['./recursos.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Recursos implements OnInit {
  /** Servicio de gestión de recursos */
  private recursoService = inject(RecursoService);
  /** Servicio de gestión de grupos */
  private grupoService = inject(GrupoService);
  /** Servicio de autenticación */
  private authService = inject(AuthService);
  /** Servicio de notificaciones */
  private notificacionService = inject(NotificacionService);
  /** Servicio de gestión de miembros */
  private miembroGrupoService = inject(MiembroGrupoService);
  /** Servicio de subida de archivos */
  private subidaArchivosService = inject(SubidaArchivosService);
  /** Router de Angular */
  private router = inject(Router);

  /** Estrategia de paginación activa (cambiar a 'paginador' si se prefiere navegación clásica) */
  readonly estrategiaPaginacion: EstrategiaPaginacion = 'scroll-infinito';

  /** Lista de recursos cargados (se acumula en scroll infinito, se reemplaza en paginador) */
  recursos = signal<RecursoResponse[]>([]);
  
  /** Total de recursos disponibles en el backend */
  totalRecursos = signal<number>(0);
  
  /** Página actual (base 0) */
  paginaActual = signal<number>(0);
  
  /** Tamaño de página */
  readonly tamanoPagina = 10;
  
  /** Signal que indica si se están cargando datos iniciales */
  loading = signal(true);
  
  /** Signal que indica si se están cargando más datos (scroll infinito) */
  cargandoMas = signal(false);
  
  /** Indica si hubo error al cargar */
  error = signal(false);
  
  /** Mensaje de error */
  errorMessage = signal('');
  
  /** Filtros actuales aplicados */
  filtrosActuales = signal<FiltrosRecurso>({ busqueda: '', tipo: '', estado: '' });
  
  /** ID del grupo actual */
  grupoId: number | null = null;
  /** ID del usuario creador */
  creadorId: number | null = null;

  /** Controla visibilidad del modal */
  mostrarModal = false;
  /** Indica si el modal está en modo edición */
  modoEdicion = false;
  /** Recurso seleccionado para edición */
  recursoSeleccionado: RecursoResponse | null = null;

  /** Calcula si hay más páginas disponibles para cargar */
  hayMasPaginas = computed(() => {
    const total = this.totalRecursos();
    const pagina = this.paginaActual();
    const tamano = this.tamanoPagina;
    return (pagina + 1) * tamano < total;
  });

  /** Indica si debe mostrarse el elemento de scroll infinito */
  mostrarScrollInfinito = computed(() => {
    return this.estrategiaPaginacion === 'scroll-infinito' && 
           this.hayMasPaginas() && 
           !this.cargandoMas() &&
           !this.loading();
  });

  /** Indica si debe mostrarse el paginador clásico */
  mostrarPaginador = computed(() => {
    return this.estrategiaPaginacion === 'paginador' && this.totalRecursos() > this.tamanoPagina;
  });

  /**
   * TrackBy function para optimizar rendering de lista.
   * 
   * @param _index - Índice del elemento (no usado)
   * @param recurso - Recurso de la lista
   * @returns ID del recurso
   */
  trackByRecursoId(_index: number, recurso: RecursoResponse): number | null | undefined {
    return recurso.id;
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario = this.authService.usuarioDetalles();
    
    if (!usuario?.miembroGrupoId) {
      this.error.set(true);
      this.errorMessage.set('No perteneces a ningún grupo');
      this.loading.set(false);
      return;
    }

    this.creadorId = usuario.id || null;

    this.miembroGrupoService.get(usuario.miembroGrupoId).subscribe({
      next: (miembro) => {
        this.grupoId = miembro.grupoId || null;
        if (this.grupoId) {
          this.cargarRecursos();
        } else {
          this.error.set(true);
          this.errorMessage.set('No se pudo obtener el ID del grupo');
          this.loading.set(false);
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del miembro:', error);
        this.error.set(true);
        this.errorMessage.set('Error al cargar los datos del grupo');
        this.loading.set(false);
      }
    });
  }

  /**
   * Carga los recursos del grupo usando paginación.
   * En modo scroll-infinito: acumula resultados.
   * En modo paginador: reemplaza resultados.
   */
  private cargarRecursos(): void {
    if (!this.grupoId) {
      this.error.set(true);
      this.errorMessage.set('No se ha podido identificar el grupo');
      this.loading.set(false);
      return;
    }

    // Si es la primera carga
    const esPrimeraCarga = this.paginaActual() === 0 && this.recursos().length === 0;
    
    if (esPrimeraCarga) {
      this.loading.set(true);
    } else {
      this.cargandoMas.set(true);
    }

    this.error.set(false);

    // Preparar filtros para el backend
    const filtros = this.prepararFiltros();

    // Usar el endpoint de grupo/recursos con paginación
    this.grupoService.getRecursos(this.grupoId, this.paginaActual(), this.tamanoPagina, filtros).subscribe({
      next: (respuesta) => {
        const items = Array.isArray(respuesta?.items)
          ? respuesta.items
          : respuesta && respuesta.items
            ? [respuesta.items]
            : [];

        this.totalRecursos.set(typeof respuesta?.total === 'number' ? respuesta.total : items.length);

        if (this.estrategiaPaginacion === 'scroll-infinito') {
          // Acumular resultados
          const recursosActuales = this.recursos();
          this.recursos.set([...recursosActuales, ...items]);
        } else {
          // Reemplazar resultados
          this.recursos.set(items);
        }

        this.loading.set(false);
        this.cargandoMas.set(false);
      },
      error: (error) => {
        console.error('Error al cargar recursos:', error);
        this.error.set(true);
        this.errorMessage.set(error.message || 'Error al cargar los recursos');
        this.loading.set(false);
        this.cargandoMas.set(false);
      }
    });
  }

  /**
   * Prepara los filtros para enviar al backend
   */
  private prepararFiltros(): { tipo?: string; estado?: string } {
    const filtros = this.filtrosActuales();
    const resultado: { tipo?: string; estado?: string } = {};

    if (filtros.tipo) {
      resultado.tipo = filtros.tipo;
    }

    if (filtros.estado) {
      resultado.estado = filtros.estado;
    }

    // Nota: Para búsqueda textual local, se filtrarían después en el cliente
    // Si el backend soporta búsqueda por texto, agregar aquí

    return resultado;
  }

  /**
   * Maneja el cambio de filtros desde el buscador.
   * Reinicia la paginación y recarga datos.
   */
  onFiltrosChange(filtros: FiltrosRecurso): void {
    this.filtrosActuales.set(filtros);
    this.paginaActual.set(0);
    this.recursos.set([]);
    this.cargarRecursos();
  }

  /**
   * Carga la siguiente página de recursos (scroll infinito)
   */
  cargarMasRecursos(): void {
    if (!this.hayMasPaginas() || this.cargandoMas()) {
      return;
    }

    this.paginaActual.update(p => p + 1);
    this.cargarRecursos();
  }

  /**
   * Maneja el cambio de página desde el paginador clásico
   */
  alCambiarPagina(nuevaPagina: number): void {
    this.paginaActual.set(nuevaPagina);
    this.recursos.set([]); // Limpia antes de cargar nueva página
    this.cargarRecursos();
  }

  verRecurso(recurso: RecursoResponse): void {
    console.log('Ver recurso:', recurso);
  }

  editarRecurso(recurso: RecursoResponse): void {
    this.recursoSeleccionado = recurso;
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  eliminarRecurso(recurso: RecursoResponse): void {
    if (!recurso.id) return;

    if (confirm(`¿Estás seguro de que deseas eliminar el recurso "${recurso.nombre}"?`)) {
      this.recursoService.delete(recurso.id).subscribe({
        next: () => {
          this.notificacionService.success('Recurso eliminado correctamente');
          // Reiniciar y recargar desde el principio
          this.paginaActual.set(0);
          this.recursos.set([]);
          this.cargarRecursos();
        },
        error: (error) => {
          console.error('Error al eliminar recurso:', error);
          this.notificacionService.error(error.mensaje || 'Error al eliminar el recurso');
        }
      });
    }
  }

  crearRecurso(): void {
    this.recursoSeleccionado = null;
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.recursoSeleccionado = null;
    this.modoEdicion = false;
  }

  guardarRecurso(datos: any): void {
    if (this.modoEdicion && this.recursoSeleccionado?.id) {
      const updateData: RecursoUpdate = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        tipo: datos.tipo,
        estadoActual: datos.estadoActual,
        capacidad: datos.capacidad,
        ubicacion: datos.ubicacion
      };

      this.recursoService.update(this.recursoSeleccionado.id, updateData).subscribe({
        next: () => {
          if (datos.archivo) {
            this.subirFotoRecurso(this.recursoSeleccionado!.id!, datos.archivo);
          } else {
            this.notificacionService.success('Recurso actualizado correctamente');
            this.cerrarModal();
            // Reiniciar y recargar desde el principio
            this.paginaActual.set(0);
            this.recursos.set([]);
            this.cargarRecursos();
          }
        },
        error: (error) => {
          console.error('Error al actualizar recurso:', error);
          this.notificacionService.error(error.mensaje || 'Error al actualizar el recurso');
        }
      });
    } else {
      if (!this.grupoId || !this.creadorId) {
        this.notificacionService.error('No se pudo identificar el grupo o usuario');
        return;
      }

      const newData: RecursoRequest = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        tipo: datos.tipo,
        estadoActual: datos.estadoActual,
        capacidad: datos.capacidad,
        ubicacion: datos.ubicacion,
        grupoId: this.grupoId,
        creadorId: this.creadorId
      };

      this.recursoService.create(newData).subscribe({
        next: (recursoCreado) => {
          if (datos.archivo && recursoCreado.id) {
            this.subirFotoRecurso(recursoCreado.id, datos.archivo);
          } else {
            this.notificacionService.success('Recurso creado correctamente');
            this.cerrarModal();
            // Reiniciar y recargar desde el principio
            this.paginaActual.set(0);
            this.recursos.set([]);
            this.cargarRecursos();
          }
        },
        error: (error) => {
          console.error('Error al crear recurso:', error);
          this.notificacionService.error(error.mensaje || 'Error al crear el recurso');
        }
      });
    }
  }

  private subirFotoRecurso(recursoId: number, archivo: File): void {
    this.subidaArchivosService.subirFotoRecurso(recursoId, archivo).subscribe({
      next: () => {
        this.notificacionService.success(this.modoEdicion ? 'Recurso actualizado correctamente' : 'Recurso creado correctamente');
        this.cerrarModal();
        // Reiniciar y recargar desde el principio
        this.paginaActual.set(0);
        this.recursos.set([]);
        this.cargarRecursos();
      },
      error: (error) => {
        console.error('Error al subir foto del recurso:', error);
        this.notificacionService.warning('Recurso guardado pero hubo un error al subir la foto');
        this.cerrarModal();
        // Reiniciar y recargar desde el principio
        this.paginaActual.set(0);
        this.recursos.set([]);
        this.cargarRecursos();
      }
    });
  }

  retry(): void {
    this.cargarDatosUsuario();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
