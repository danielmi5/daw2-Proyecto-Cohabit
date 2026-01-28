import { Component, OnInit, inject, effect, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardRecurso } from '../../components/shared/card-recurso/card-recurso';
import { BuscadorFiltros, FiltrosRecurso } from '../../components/shared/buscador-filtros/buscador-filtros';
import { Button } from '../../components/shared/button/button';
import { ModalRecurso } from '../../components/shared/modal-recurso/modal-recurso';
import { RecursoResponse, RecursoRequest, RecursoUpdate } from '../../models';
import { RecursoService } from '../../services/recurso.service';
import { GrupoService } from '../../services/grupo.service';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { MiembroGrupoService } from '../../services/miembro-grupo.service';
import { SubidaArchivosService } from '../../services/subida-archivos.service';
import { StateService } from '../../services/state.service';

// Página CRUD de recursos del grupo con búsqueda/filtrado
@Component({
  selector: 'app-recursos',
  imports: [CommonModule, CardRecurso, BuscadorFiltros, Button, ModalRecurso],
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

  /** Lista completa de recursos del grupo */
  recursos: RecursoResponse[] = [];
  /** Lista de recursos filtrados según criterios de búsqueda */
  recursosFiltrados: RecursoResponse[] = [];
  /** Total de recursos */
  total = 0;
  /** Signal que indica si se están cargando datos */
  loading = signal(true);
  /** Indica si hubo error al cargar */
  error = false;
  /** Mensaje de error */
  errorMessage = '';
  
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
      this.error = true;
      this.errorMessage = 'No perteneces a ningún grupo';
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
          this.error = true;
          this.errorMessage = 'No se pudo obtener el ID del grupo';
          this.loading.set(false);
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del miembro:', error);
        this.error = true;
        this.errorMessage = 'Error al cargar los datos del grupo';
        this.loading.set(false);
      }
    });
  }

  cargarRecursos(): void {
    if (!this.grupoId) {
      this.error = true;
      this.errorMessage = 'No se ha podido identificar el grupo';
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error = false;

    this.grupoService.getRecursos(this.grupoId).subscribe({
      next: (recursos) => {
        // ApiListResponse<T> has the shape { items: T[], total: number }
        this.recursos = recursos.items || [];
        this.recursosFiltrados = [...this.recursos];
        this.total = typeof recursos.total === 'number' ? recursos.total : this.recursos.length;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar recursos:', error);
        this.error = true;
        this.errorMessage = error.message || 'Error al cargar los recursos';
        this.loading.set(false);
      }
    });
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
        this.cargarRecursos();
      },
      error: (error) => {
        console.error('Error al subir foto del recurso:', error);
        this.notificacionService.warning('Recurso guardado pero hubo un error al subir la foto');
        this.cerrarModal();
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
