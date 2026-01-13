import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';

@Component({
  selector: 'app-caracteristica',
  standalone: true,
  imports: [CommonModule, FeatherIconDirective],
  templateUrl: './caracteristica.html',
  styleUrls: ['./caracteristica.scss'],
})
export class Caracteristica {
  @Input() icon = 'check-circle';
}
