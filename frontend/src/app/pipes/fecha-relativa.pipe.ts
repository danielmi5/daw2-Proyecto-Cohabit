import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaRelativa',
  standalone: true
})
export class FechaRelativaPipe implements PipeTransform {
  transform(value: Date | string | null): string {
    if (!value) return '';

    const fecha = typeof value === 'string' ? new Date(value) : value;
    const ahora = new Date();
    const diferenciaMilisegundos = ahora.getTime() - fecha.getTime();
    const diferenciaSegundos = Math.floor(diferenciaMilisegundos / 1000);
    const diferenciaMinutos = Math.floor(diferenciaSegundos / 60);
    const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
    const diferenciaDias = Math.floor(diferenciaHoras / 24);

    if (diferenciaSegundos < 60) {
      return 'hace un momento';
    } else if (diferenciaMinutos < 60) {
      return `hace ${diferenciaMinutos} minuto${diferenciaMinutos !== 1 ? 's' : ''}`;
    } else if (diferenciaHoras < 24) {
      return `hace ${diferenciaHoras} hora${diferenciaHoras !== 1 ? 's' : ''}`;
    } else if (diferenciaDias < 7) {
      return `hace ${diferenciaDias} día${diferenciaDias !== 1 ? 's' : ''}`;
    } else if (diferenciaDias < 30) {
      const semanas = Math.floor(diferenciaDias / 7);
      return `hace ${semanas} semana${semanas !== 1 ? 's' : ''}`;
    } else if (diferenciaDias < 365) {
      const meses = Math.floor(diferenciaDias / 30);
      return `hace ${meses} mes${meses !== 1 ? 'es' : ''}`;
    } else {
      const años = Math.floor(diferenciaDias / 365);
      return `hace ${años} año${años !== 1 ? 's' : ''}`;
    }
  }
}
