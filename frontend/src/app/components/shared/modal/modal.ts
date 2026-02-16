import { Component, Input, Output, EventEmitter, HostListener, inject, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
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
export class Modal implements AfterViewInit {
  private router = inject(Router);
  private modalService = inject(ModalService);

  @Input() variante: 'pedirAuth' | 'salirAuth' | undefined;
  @Output() cierre = new EventEmitter<void>();

  @ViewChild('modalPanel', { read: ElementRef }) modalPanel!: ElementRef<HTMLElement>;
  private elementoAnterior: HTMLElement | null = null;

  /**
   * Establece el focus trap después de inicializar la vista
   * @public
   */
  ngAfterViewInit(): void {
    // Guardar el elemento que tenía foco antes de abrir el modal
    this.elementoAnterior = document.activeElement as HTMLElement;
    
    // Enfocar el primer elemento interactivo dentro del modal
    setTimeout(() => {
      this.enfocarPrimerElemento();
    });
  }

  /**
   * Enfoca el primer elemento interactivo del modal
   * @private
   */
  private enfocarPrimerElemento(): void {
    const elementosEnfocables = this.obtenerElementosEnfocables();
    if (elementosEnfocables.length > 0) {
      elementosEnfocables[0].focus();
    }
  }

  /**
   * Obtiene todos los elementos enfocables dentro del modal
   * @private
   */
  private obtenerElementosEnfocables(): HTMLElement[] {
    if (!this.modalPanel) return [];
    
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const elementos = this.modalPanel.nativeElement.querySelectorAll(selector);
    return Array.from(elementos) as HTMLElement[];
  }

  /**
   * Maneja la navegación por Tab para mantener el foco dentro del modal
   * @param event - Evento de teclado
   * @private
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const elementosEnfocables = this.obtenerElementosEnfocables();
    if (elementosEnfocables.length === 0) return;

    const primerElemento = elementosEnfocables[0];
    const ultimoElemento = elementosEnfocables[elementosEnfocables.length - 1];

    // Si estamos en el último elemento y presionamos Tab (sin Shift), ir al primero
    if (!event.shiftKey && document.activeElement === ultimoElemento) {
      event.preventDefault();
      primerElemento.focus();
    }
    // Si estamos en el primer elemento y presionamos Shift+Tab, ir al último
    else if (event.shiftKey && document.activeElement === primerElemento) {
      event.preventDefault();
      ultimoElemento.focus();
    }
  }

  /**
   * Cierra el modal y emite evento de cierre
   * @public
   */
  cerrarModal(): void {
    this.modalService.cerrar();
    this.cierre.emit();
    this.restaurarFoco();
  }

  /**
   * Restaura el foco al elemento que tenía foco antes de abrir el modal
   * @private
   */
  private restaurarFoco(): void {
    if (this.elementoAnterior) {
      setTimeout(() => {
        this.elementoAnterior?.focus();
      });
    }
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
