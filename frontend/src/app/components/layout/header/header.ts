import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatherIconDirective } from '../../../directives/feather-icon.directive';
import { Tooltip } from '../../shared/tooltip/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FeatherIconDirective, Tooltip],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit {
  modoIcon = 'sun';
  modoTitle = 'Cambiar a modo oscuro';
  menuAbierto = false;

  ngOnInit(): void {
    const temaAlmacenado = localStorage.getItem('theme');
    const esOscuro = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (temaAlmacenado === 'dark') document.documentElement.classList.add('dark');
    else if (temaAlmacenado === 'light') document.documentElement.classList.remove('dark');
    else if (esOscuro) document.documentElement.classList.add('dark');

    this.actualizarIcono();
  }

  alternarTema(): void {
    const esAhoraOscuro = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', esAhoraOscuro ? 'dark' : 'light');
    this.actualizarIcono();
  }

  private actualizarIcono(): void {
    const esModoOscuro = document.documentElement.classList.contains('dark');
    this.modoIcon = esModoOscuro ? 'moon' : 'sun';
    this.modoTitle = esModoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }
}
