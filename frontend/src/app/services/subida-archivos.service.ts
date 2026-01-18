import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SubidaArchivosService {
  constructor(private api: ApiService) {}

  /** Sube un archivo genérico a un endpoint usando ApiService.subirArchivo */
  subir(endpoint: string, archivo: File, camposAdicionales?: { [key: string]: string | Blob }) : Observable<any> {
    return this.api.subirArchivo(endpoint, archivo, camposAdicionales);
  }

  /** Método especializado para subir la foto de un grupo */
  subirFotoGrupo(grupoId: number, archivo: File) : Observable<any> {
    const endpoint = `/api/grupos/${grupoId}/foto`;
    return this.subir(endpoint, archivo);
  }
}
