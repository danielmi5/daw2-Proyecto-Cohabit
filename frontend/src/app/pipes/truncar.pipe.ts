import { Pipe, PipeTransform } from '@angular/core';

// Pipe standalone para truncar cadenas de texto a una longitud máxima.
// Añade un sufijo personalizable (por defecto "...") cuando se trunca.
//
// Ejemplo:
// <p>{{ descripcionLarga | truncar:100 }}</p>
// <span>{{ titulo | truncar:50:'...' }}</span>
@Pipe({
  name: 'truncar',
  standalone: true
})
export class TruncarPipe implements PipeTransform {
  // Trunca un texto al límite y le pone el sufijo ('...' por defecto)
  transform(value: string | null, limite: number = 50, sufijo: string = '...'): string {
    if (!value) return '';
    
    if (value.length <= limite) {
      return value;
    }
    
    return value.substring(0, limite).trim() + sufijo;
  }
}
