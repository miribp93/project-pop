import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.css'],
  imports: [MATERIAL_MODULES,ReactiveFormsModule,CommonModule]
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  showPassword = false;   // Controla la visibilidad de la nueva contraseña
  showPassword2 = false;  // Controla la visibilidad de la confirmación de contraseña

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alert: NotificationService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        newPass: ['', [Validators.required, Validators.minLength(8)]],
        newPass2: ['', Validators.required],
      },
      { validator: this.matchPasswords('newPass', 'newPass2') } // Validador personalizado para contraseñas
    );
  }

  // Validador personalizado para comparar contraseñas
  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl) => {
      const passControl = formGroup.get(password);
      const confirmPassControl = formGroup.get(confirmPassword);

      if (!passControl || !confirmPassControl) {
        return;
      }

      if (
        confirmPassControl.errors &&
        !confirmPassControl.errors['mustMatch']
      ) {
        return;
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ mustMatch: true });
      } else {
        confirmPassControl.setErrors(null); // Limpiar errores cuando coinciden
      }
    };
  }

  // Alterna la visibilidad del campo de contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Alterna la visibilidad del campo de confirmación de contraseña
  toggleShowPassword2() {
    this.showPassword2 = !this.showPassword2;
  }

  // Método para manejar la recuperación de contraseña
  resetPass() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const resetData = this.resetPasswordForm.value;

    this.authService.resetPassword(resetData.email, resetData.newPass).subscribe(
      (response) => {
        this.alert.show('Contraseña actualizada exitosamente');
        this.router.navigate(['/login']); // Redirige al login después de la recuperación
      },
      (error) => {
        console.error('Error al restablecer contraseña', error);
        const errorMsg =
          error.error?.message || 'Error al restablecer la contraseña';
        this.alert.show(errorMsg);
      }
    );
  }
}
