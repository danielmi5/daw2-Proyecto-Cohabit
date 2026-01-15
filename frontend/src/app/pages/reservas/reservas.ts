import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiListResponse, ReservaResponse } from '../../models';
import { ReservasResolverData } from '../../resolvers/reservas.resolver';
import { FeatherIconDirective } from '../../directives/feather-icon.directive';
import { Button } from '../../components/shared/button/button';

import { TabComponent } from '../../components/shared/tab/tab';

@Component({
  selector: 'app-reservas',
  imports: [CommonModule, Button, TabComponent],
  templateUrl: './reservas.html',
  styleUrl: './reservas.scss',
})
export class Reservas implements OnInit {
  reservas: ReservaResponse[] = [];
  total = 0;
  error = false;
  errorMessage = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtiene los datos del resolver
    const data = this.route.snapshot.data['reservasData'] as ReservasResolverData;
    
    this.loading = false;

    if (data.error) {
      // Maneja el caso de error
      this.error = true;
      this.errorMessage = data.errorMessage || 'Error al cargar las reservas';
      this.reservas = [];
      this.total = 0;
    } else if (data.reservas) {
      // Maneja el caso de éxito
      this.error = false;
      this.reservas = data.reservas.items;
      this.total = data.reservas.total;
    }
  }

  /**
   * Reintentar la carga de datos
   */
  retry(): void {
    this.loading = true;
    this.error = false;
    // Recarga la ruta para volver a ejecutar el resolver
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/dashboard/reservas']);
    });
  }

  /**
   * Va a la página del dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
