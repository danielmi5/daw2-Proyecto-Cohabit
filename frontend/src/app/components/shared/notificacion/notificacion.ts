import { Component, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificacionService } from '../../../services/notificacion.service';
import { Alert } from '../alert/alert';

@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [Alert],
  templateUrl: './notificacion.html',
  styleUrl: './notificacion.scss',
  animations: [
    trigger('notificacionAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-0.5rem)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-0.25rem)' }))
      ])
    ])
  ]
})
export class Notificacion {
  protected notificacionService = inject(NotificacionService);
}
