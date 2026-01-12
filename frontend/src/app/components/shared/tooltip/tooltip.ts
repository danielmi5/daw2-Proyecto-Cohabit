import { Component, Input, OnDestroy } from '@angular/core';

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

  onMouseEnter(): void {
    this.limpiarTemporizadorOcultar();
    this.limpiarTemporizadorMostrar();
    this.temporizadorMostrar = window.setTimeout(() => (this.visible = true), this.delay);
  }

  onMouseLeave(): void {
    this.limpiarTemporizadorMostrar();
    this.limpiarTemporizadorOcultar();
    this.temporizadorOcultar = window.setTimeout(() => (this.visible = false), this.delay);
  }

  onFocusIn(): void {
    this.onMouseEnter();
  }

  onFocusOut(): void {
    this.onMouseLeave();
  }

  private limpiarTemporizadorMostrar() {
    if (this.temporizadorMostrar !== undefined) {
      clearTimeout(this.temporizadorMostrar);
      this.temporizadorMostrar = undefined;
    }
  }

  private limpiarTemporizadorOcultar() {
    if (this.temporizadorOcultar !== undefined) {
      clearTimeout(this.temporizadorOcultar);
      this.temporizadorOcultar = undefined;
    }
  }

  ngOnDestroy(): void {
    this.limpiarTemporizadorMostrar();
    this.limpiarTemporizadorOcultar();
  }
}
