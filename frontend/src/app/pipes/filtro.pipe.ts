import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro',
  standalone: true
})
export class FiltroPipe implements PipeTransform {
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
