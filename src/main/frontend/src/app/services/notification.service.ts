import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root' // Disponible en todo el proyecto
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  // Método para mostrar notificaciones
  show(message: string, action: string = 'Cerrar', duration: number = 3000): void {
    this.snackBar.open(message, action, { duration });
  }

  // Otros métodos si necesitas más personalización
  showSuccess(message: string): void {
    this.show(message, 'OK', 5000);
  }

  showError(message: string): void {
    this.show(message, 'Cerrar', 5000);
  }
}
