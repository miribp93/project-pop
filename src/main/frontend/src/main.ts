import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';  // Importa appConfig correctamente
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)  // Usas appConfig aquí
  .catch((err) => console.error(err));
