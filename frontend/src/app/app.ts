import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Main } from './components/layout/main/main';
import { Footer } from './components/layout/footer/footer';
import { Modal } from './components/shared/modal/modal';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Main, Footer, Modal],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('frontend');
  protected modalService = inject(ModalService);
}
