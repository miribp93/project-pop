import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, MATERIAL_MODULES, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  editMode: boolean = false; // Flag para verificar si estamos en modo edición

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // Inyectamos ActivatedRoute para obtener parámetros de URL
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        last_name1: ['', Validators.required],
        last_name2: [''],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{9,}$')]], // Permite al menos 9 dígitos
        street: ['', Validators.required],
        city: ['', Validators.required],
        postal_code: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')],],
        password: ['', [Validators.required, Validators.minLength(8)]], // Ajustado a 8 caracteres
        password2: ['', Validators.required],
        username: ['', Validators.required],
      },
      {
        validator: this.matchPasswords('password', 'password2'),
      }
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
  // Métodos auxiliares para facilitar el acceso a los controles desde la plantilla
  get f() {
    return this.registerForm.controls;
  }


  ngOnInit(): void {
    // Revisamos si estamos en modo edición
    this.route.queryParams.subscribe((params) => {
      this.editMode = params['editMode'] === 'true'; // Detectamos el parámetro editMode
      if (this.editMode) {
        // Si estamos en modo edición, cargamos los datos del usuario
        this.loadUserData();
      }
    });
  }

  loadUserData(): void {
    // Aquí se debería cargar la información del usuario logueado
    this.authService.getCurrentUser().subscribe(
      (user) => {
        // Si la petición tiene éxito, cargamos los datos en el formulario
        this.registerForm.patchValue({
          name: user.name,
          last_name1: user.last_name1,
          last_name2: user.last_name2,
          email: user.email,
          phone: user.phone,
          street: user.street,
          city: user.city,
          postal_code: user.postal_code,
          username: user.username,
        });
      },
      (error) => {
        console.error('Error al cargar datos de usuario:', error);
        alert('No se pudieron cargar los datos del usuario.');
      }
    );
  }

  // Método para manejar el registro o la actualización del perfil
  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const userData = this.registerForm.value;

    if (this.editMode) {
      // Si estamos en modo edición, actualizamos el perfil
      this.authService.update(userData).subscribe(
        (response) => {
          alert('Perfil actualizado exitosamente');
          this.router.navigate(['/user-profile']); // Redirige al perfil del usuario
        },
        (error) => {
          console.error('Error al actualizar el perfil', error);
          const errorMsg =
            error.error?.message || 'Error al actualizar el perfil';
          alert(errorMsg);
        }
      );
    } else {
      // Si no estamos en modo edición, registramos un nuevo usuario
      this.authService.register(userData).subscribe(
        (response) => {
          alert('Registro exitoso');
          this.router.navigate(['/login']); // Redirige al login después del registro
        },
        (error) => {
          console.error('Error en el registro', error);
          const errorMsg =
            error.error?.message || 'Error al registrar el usuario';
          alert(errorMsg);
        }
      );
    }
  }
}
