import { Component, inject } from '@angular/core';
import { Button } from '../../components/shared/button/button';
import { NotificacionService } from '../../services/notificacion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  imports: [Button],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  private notificationService = inject(NotificacionService);
  private authService = inject(AuthService);
  
  cerrarSesion(): void{
    try {
      this.authService.cerrarSesion()
      this.notificationService.success("Se ha cerrado la sesión correctamente");
    } catch (error) {
      this.notificationService.error("Ha ocurrido un error. No se ha podido cerrar sesión.");
    }
  }
}

