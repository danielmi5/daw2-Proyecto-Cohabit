import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors} from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { routes } from './app.routes';

// Configuración principal de la aplicación Angular standalone.
// Define todos los providers necesarios para el funcionamiento de la aplicación.
//
// Providers configurados:
// - Zone change detection con event coalescing para mejor rendimiento
// - Router con definición de rutas
// - Animaciones del navegador
// - HttpClient con interceptores funcionales:
//   - authInterceptor: Añade token JWT a las peticiones
//   - errorInterceptor: Manejo centralizado de errores HTTP
//   - loggingInterceptor: Registro de peticiones HTTP
// - Global error listeners para captura de errores no manejados
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor, loggingInterceptor]) // aquí se registran los interceptores
    )
  ]
};

