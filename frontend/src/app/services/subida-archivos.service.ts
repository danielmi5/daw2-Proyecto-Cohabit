import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SubidaArchivosService {
  readonly MAX_TAMANIO = 5 * 1024 * 1024; // 5 MB

  constructor(private api: ApiService) {}

  /** Sube un archivo a un endpoint usando ApiService.subirArchivo */
  subir(endpoint: string, archivo: File, camposAdicionales?: { [key: string]: string | Blob },metodo: 'POST' | 'PUT' = 'POST') : Observable<any> {
    // Validación del tamaño del archivo
    if (archivo && archivo.size > this.MAX_TAMANIO) {
      const mensaje = `El archivo supera el tamaño máximo de ${this.MAX_TAMANIO / (1024 * 1024)} MB`;
      // Devuelve un error observable con estructura similar a HttpErrorResponse
      return throwError(() => ({ status: 413, error: { message: mensaje } }));
    }
    return this.api.subirArchivo(endpoint, archivo, camposAdicionales, metodo);
  }

  /** Método especializado para subir la foto de un grupo */
  subirFotoGrupo(grupoId: number, archivo: File, camposAdicionales?: { [key: string]: string | Blob }) : Observable<any> {
    const endpoint = `/api/grupos/${grupoId}/foto`;
    return this.subir(endpoint, archivo, camposAdicionales, 'PUT');
  }

  subirFotoRecurso(recursoId: number, archivo: File, camposAdicionales?: { [key: string]: string | Blob }) : Observable<any> {
    const endpoint = `/api/recursos/${recursoId}/foto`;
    return this.subir(endpoint, archivo, camposAdicionales, 'PUT');
  }

  /** Método especializado para subir la foto de perfil de un usuario */
  subirFotoPerfil(usuarioId: number, archivo: File, camposAdicionales?: { [key: string]: string | Blob }) : Observable<any> {
    const endpoint = `/api/usuarios/${usuarioId}/foto`;
    return this.subir(endpoint, archivo, camposAdicionales, 'PUT');
  }
}
