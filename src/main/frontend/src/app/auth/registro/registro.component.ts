import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MATERIAL_MODULES,
    CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      last_name1: ['', Validators.required],
      last_name2: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9,}$')]], // Permite al menos 9 dígitos
      street: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]], // Ajustado a 8 caracteres
      password2: ['', Validators.required],
      username: ['', Validators.required],
    }, {
      validator: this.matchPasswords('password', 'password2')
    });
  }

  // Validador personalizado para comparar contraseñas
  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl) => {
      const passControl = formGroup.get(password);
      const confirmPassControl = formGroup.get(confirmPassword);

      if (!passControl || !confirmPassControl) {
        return;
      }

      if (confirmPassControl.errors && !confirmPassControl.errors['mustMatch']) {
        // Retorna si ya tiene otros errores de validación
        return;
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ mustMatch: true });
      } else {
        confirmPassControl.setErrors(null); // Limpiar errores cuando coinciden
      }
    };
  }

  // Método para manejar el registro
  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const userData = this.registerForm.value;

    this.authService.register(userData).subscribe(
      response => {
        alert('Registro exitoso');
        this.router.navigate(['/login']); // Redirige al inicio de sesión tras el registro, si lo implementamos antes del pago hay que redirigir a la pagina de pay
      },
      error => {
        console.error('Error en el registro', error);
        const errorMsg = error.error?.message || 'Error al registrar el usuario';
        alert(errorMsg);
      }
    );
  }

  // Métodos auxiliares para facilitar el acceso a los controles desde la plantilla
  get f() {
    return this.registerForm.controls;
  }
}
