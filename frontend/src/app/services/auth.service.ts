// TODO: Implementar con backend
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly KEY = "auth_token";
  autenticado(): boolean {
    return !!localStorage.getItem(this.KEY);
  }

  iniciarSesion(email: string, contrasenia: string): Observable<boolean> {
    if (email && contrasenia) {
      localStorage.setItem(this.KEY, "token");
      return of(true);
    }
    return of(false);
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.KEY);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.KEY);
  }
}
