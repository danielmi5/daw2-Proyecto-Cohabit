import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Main } from './components/layout/main/main';
import { Footer } from './components/layout/footer/footer';
import { Modal } from './components/shared/modal/modal';
import { Notificacion } from './components/shared/notificacion/notificacion';
import { Breadcrumb } from './components/shared/breadcrumb/breadcrumb';
import { ModalService } from './services/modal.service';

// Componente raíz de la aplicación Cohabit.
// Componente standalone que estructura el layout principal con header, main y footer.
// Incluye componentes compartidos: modal, notificaciones y breadcrumbs.
//
// - Utiliza signals para gestión reactiva del estado
// - Inyecta ModalService mediante inject() para gestión centralizada de modales
// - Estructura de layout fija con RouterOutlet para navegación dinámica
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Main, Footer, Modal, Notificacion, Breadcrumb],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  // Signal con el título de la aplicación
  // @protected
  // @readonly
  protected readonly title = signal('frontend');
  
  // Servicio de modales inyectado para uso en el template
  // @protected
  protected modalService = inject(ModalService);
}
