import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgotPassword',
  templateUrl: './forgotPassword.component.html',
  standalone :true,
  imports:  [
    MATERIAL_MODULES,
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./forgotPassword.component.css'],
})
export class ForgotPasswordComponent {
  email = '';

  constructor(private authService: AuthService, private router: Router) {}

  onResetPassword(): void {
    this.authService.sendEmailPassword(this.email).subscribe(
      () => {
        alert('Correo de restablecimiento enviado si el usuario existe.');
        this.router.navigate(['/login']);
      },
      (error) => console.error('Error al enviar el correo de recuperación:', error)
    );
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }
}
