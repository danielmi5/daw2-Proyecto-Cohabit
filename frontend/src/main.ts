import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Punto de entrada principal de la aplicación Angular standalone.
// Bootstrapea el componente raíz App con la configuración definida en appConfig.
//
// - Utiliza bootstrapApplication de Angular 20 para aplicaciones standalone
// - Captura y registra errores durante el bootstrap en la consola
// - No requiere AppModule (arquitectura sin NgModule)
bootstrapApplication(App, appConfig)
  .catch((err: any) => console.error(err));
