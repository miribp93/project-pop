import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Servicio que maneja la recuperación de contraseña
import { Router } from '@angular/router';
import { MATERIAL_MODULES } from '../../material/material/material.component';

@Component({
  selector: 'app-forgotPassword',
  templateUrl: './forgotPassword.component.html',
  standalone :true,
  imports:  [
    MATERIAL_MODULES
  ],
  styleUrls: ['./forgotPassword.component.css'],
})
export class ForgotPasswordComponent {
  email = '';

  constructor(private authService: AuthService, private router: Router) {}

  onResetPassword(): void {
    this.authService.resetPassword(this.email).subscribe(
      () => {
        alert('Se ha enviado un correo para recuperar su contraseña.');
        this.router.navigate(['/login']); // Redirige al inicio de sesión
      },
      (error) => console.error('Error al enviar el correo de recuperación:', error)
    );
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }
}
