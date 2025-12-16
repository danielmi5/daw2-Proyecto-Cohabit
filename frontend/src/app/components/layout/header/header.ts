import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit {
  icono = '/header/modo-claro.svg';
  modoTitle = 'Cambiar a modo oscuro';

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
    this.icono = esModoOscuro ? '/header/modo-oscuro.svg' : '/header/modo-claro.svg';
    this.modoTitle = esModoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  }
}
