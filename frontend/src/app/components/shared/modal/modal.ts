import { Component, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service';

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

  cerrarModal(): void {
    this.modalService.cerrar();
    this.cierre.emit();
  }

  iniciarSesion(): void {
    const url = this.modalService.obtenerUrlRetorno();
    this.router.navigate(['/login'], { queryParams: url ? { returnUrl: url } : {} });
    this.modalService.cerrar();
  }

  confirmarSalida(): void {
    this.modalService.confirmar();
  }

  cancelarSalida(): void {
    this.modalService.cancelar();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(_event: unknown): void {
    this.cerrarModal();
  }
}
