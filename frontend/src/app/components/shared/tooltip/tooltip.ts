import { Component, Input, OnDestroy } from '@angular/core';

// Tooltip que aparece con delay al hacer hover o focus
@Component({
  selector: 'app-tooltip',
  standalone: true,
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.scss'],
})
export class Tooltip implements OnDestroy {
  @Input() texto: string = 'Información';
  @Input() delay: number = 300; // ms

  visible: boolean = false;
  private temporizadorMostrar: number | undefined;
  private temporizadorOcultar: number | undefined;

  /**
   * Maneja el evento mouseenter.
   * 
   * @remarks
   * Limpia temporizadores previos y establece uno nuevo para mostrar el tooltip.
   */
  onMouseEnter(): void {
    this.limpiarTemporizadorOcultar();
    this.limpiarTemporizadorMostrar();
    this.temporizadorMostrar = window.setTimeout(() => (this.visible = true), this.delay);
  }

  /**
   * Maneja el evento mouseleave.
   * 
   * @remarks
   * Limpia temporizadores previos y establece uno nuevo para ocultar el tooltip.
   */
  onMouseLeave(): void {
    this.limpiarTemporizadorMostrar();
    this.limpiarTemporizadorOcultar();
    this.temporizadorOcultar = window.setTimeout(() => (this.visible = false), this.delay);
  }

  /**
   * Maneja el evento focusin (cuando el elemento recibe foco).
   */
  onFocusIn(): void {
    this.onMouseEnter();
  }

  /**
   * Maneja el evento focusout (cuando el elemento pierde foco).
   */
  onFocusOut(): void {
    this.onMouseLeave();
  }

  /**
   * Limpia el temporizador de mostrar si existe.
   */
  private limpiarTemporizadorMostrar() {
    if (this.temporizadorMostrar !== undefined) {
      clearTimeout(this.temporizadorMostrar);
      this.temporizadorMostrar = undefined;
    }
  }

  /**
   * Limpia el temporizador de ocultar si existe.
   */
  private limpiarTemporizadorOcultar() {
    if (this.temporizadorOcultar !== undefined) {
      clearTimeout(this.temporizadorOcultar);
      this.temporizadorOcultar = undefined;
    }
  }

  /**
   * Limpia todos los temporizadores al destruir el componente.
   */
  ngOnDestroy(): void {
    this.limpiarTemporizadorMostrar();
    this.limpiarTemporizadorOcultar();
  }
}
