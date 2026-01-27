import { Component, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { RedireccionService } from '../../../services/redireccion.service';

// Modal global con variantes: pedirAuth (login requerido), salirAuth (confirmar salida con cambios sin guardar)
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
})
export class Modal {
  private router = inject(Router);
  private modalService = inject(ModalService);

  @Input() variante: 'pedirAuth' | 'salirAuth' | undefined;
  @Output() cierre = new EventEmitter<void>();

  /**
   * Cierra el modal y emite evento de cierre
   * @public
   */
  cerrarModal(): void {
    this.modalService.cerrar();
    this.cierre.emit();
  }

  /**
   * Navega a la página de login y cierra el modal
   * @public
   */
  iniciarSesion(): void {
    this.router.navigate(['/login']);
    this.modalService.cerrar();
  }

  /**
   * Confirma la acción del modal (variante salirAuth)
   * @public
   */
  confirmarSalida(): void {
    this.modalService.confirmar();
  }

  /**
   * Cancela la acción del modal (variante salirAuth)
   * @public
   */
  cancelarSalida(): void {
    this.modalService.cancelar();
  }

  /**
   * Maneja el evento de tecla Escape para cerrar el modal
   * @param _event - Evento de teclado (no utilizado)
   * @public
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(_event: unknown): void {
    this.cerrarModal();
  }
}
