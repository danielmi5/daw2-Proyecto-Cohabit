import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { Tooltip } from '../../shared/tooltip/tooltip';
import { ThemeSwitcherService } from '../../../services/theme-switcher.service';
import { Subscription } from 'rxjs';

// Header con navegación, alternador de tema y menú responsive para móviles
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FeatherIconDirective, Tooltip],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit, OnDestroy {
  modoIcon = 'sun';
  modoTitle = 'Cambiar a modo oscuro';
  menuAbierto = false;
  private themeSub?: Subscription;
  private readonly breakpointTablet = 768;

  constructor(private themeSwitcher: ThemeSwitcherService) {}

  ngOnInit(): void {
    this.themeSwitcher.init();
    this.themeSub = this.themeSwitcher.isDark$.subscribe(esModoOscuro => {
      this.modoIcon = esModoOscuro ? 'moon' : 'sun';
      this.modoTitle = esModoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    });

    // Cerrar menú si la ventana ya es ancha al iniciar
    if (typeof window !== 'undefined' && window.innerWidth >= this.breakpointTablet) {
      this.menuAbierto = false;
    }
  }

  alternarTema(): void {
    this.themeSwitcher.alternarTema();
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(_event: unknown): void {
    if (this.menuAbierto) {
      this.menuAbierto = false;
    }
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width >= this.breakpointTablet && this.menuAbierto) {
      this.menuAbierto = false;
    }
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
