import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-forgotPassword',
  templateUrl: './forgot-password.component.html',
  standalone :true,
  imports:  [
    MATERIAL_MODULES,
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email = '';

  constructor(private authService: AuthService, private router: Router,private alert: NotificationService) {}

  onResetPassword(): void {
    this.authService.sendEmailPassword(this.email).subscribe(
      () => {
        this.alert.show('Correo de restablecimiento enviado si el usuario existe.');
        this.router.navigate(['/home']);
      },
      (error) => console.error('Error al enviar el correo de recuperación:', error)
    );
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }
}
