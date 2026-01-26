import { Pipe, PipeTransform } from '@angular/core';

// Pipe standalone para filtrar arrays de objetos por un campo específico.
// Soporta búsqueda case-insensitive para strings y comparación exacta para otros tipos.
//
// Ejemplo:
// <div *ngFor="let item of items | filtro:'nombre':'juan'">
//   {{ item.nombre }}
// </div>
@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {
  // Filtra array por campo. Para strings usa búsqueda case-insensitive.
  transform<T>(items: T[] | null, campo: keyof T, valor: any): T[] {
    if (!items || !campo || valor === undefined || valor === null || valor === '') {
      return items || [];
    }

    return items.filter(item => {
      const valorCampo = item[campo];
      
      if (typeof valorCampo === 'string' && typeof valor === 'string') {
        return valorCampo.toLowerCase().includes(valor.toLowerCase());
      }
      
      return valorCampo === valor;
    });
  }
}
