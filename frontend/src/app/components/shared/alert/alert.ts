import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [FeatherIconDirective],
  templateUrl: './alert.html',
  styleUrls: ['./alert.scss'],
})
export class Alert {
  @Input() tipo: 'exito' | 'error' | 'warning' | 'info' = 'info';
  @Input() cerrable: boolean = true;
  @Output() cerrar = new EventEmitter<void>();

  alCerrar(): void {
    this.cerrar.emit();
  }
}
