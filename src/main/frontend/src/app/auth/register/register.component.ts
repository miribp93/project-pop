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
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

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
  showPassword = false;   // Controla la visibilidad de la contraseña
  showPassword2 = false;  // Controla la visibilidad de la confirmación de contraseña

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,private alert: NotificationService
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
        password: ['', [Validators.minLength(8)]], // Sin validación obligatoria por defecto
        password2: [''],
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

  // Alterna la visibilidad del campo de contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Alterna la visibilidad del campo de confirmación de contraseña
  toggleShowPassword2() {
    this.showPassword2 = !this.showPassword2;
  }

    ngOnInit(): void {
      this.route.queryParams.subscribe((params) => {
        this.editMode = params['editMode'] === 'true';

        if (this.editMode) {
          // Si estamos en modo edición
          this.loadUserData();

          // Hacer opcionales todos los campos menos los de lectura
          this.registerForm.get('name')?.clearValidators();
          this.registerForm.get('last_name1')?.clearValidators();
          this.registerForm.get('last_name2')?.clearValidators();
          this.registerForm.get('phone')?.clearValidators();
          this.registerForm.get('street')?.clearValidators();
          this.registerForm.get('city')?.clearValidators();
          this.registerForm.get('postal_code')?.clearValidators();
          this.registerForm.get('password')?.clearValidators();
          this.registerForm.get('password2')?.clearValidators();

          // Establecemos los campos como solo lectura si es necesario
          this.registerForm.get('username')?.disable();
          this.registerForm.get('email')?.disable();
        } else {
          // Si estamos en modo registro
          this.registerForm.get('name')?.clearValidators();
          this.registerForm.get('last_name1')?.clearValidators();
          this.registerForm.get('last_name2')?.clearValidators();
          this.registerForm.get('phone')?.clearValidators();
          this.registerForm.get('street')?.clearValidators();
          this.registerForm.get('city')?.clearValidators();
          this.registerForm.get('postal_code')?.clearValidators();

          // Requerir los campos del registro
          this.registerForm.get('username')?.enable();
          this.registerForm.get('email')?.enable();
          this.registerForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
          this.registerForm.get('password2')?.setValidators([Validators.required]);
        }

        // Actualizamos las validaciones del formulario
        this.registerForm.updateValueAndValidity();
      });
    }

    onRegister(): void {
      if (this.registerForm.invalid) {
        return;
      }

      const userData = this.registerForm.value;

      if (this.editMode) {
        // Actualizar perfil
        this.authService.updateUser(userData).subscribe(
          () => {
            this.alert.show('Perfil actualizado exitosamente');
            this.router.navigate(['/profile']);
          },
          (error) => {
            console.error('Error al actualizar perfil:', error);
            this.alert.show('Error al actualizar perfil');
          }
        );
      } else {
        // Registrar nuevo usuario
        this.authService.register(userData).subscribe(
          () => {
            this.alert.show('Registro exitoso');
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Error al registrar usuario:', error);
            this.alert.show('Error al registrar usuario');
          }
        );
      }
    }

    cancelar(){
      if(this.editMode== true){
        this.router.navigate(['/profile'])
      }else {
        this.router.navigate(['/'])
      }
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
        this.alert.show('No se pudieron cargar los datos del usuario.');
      }
    );
  }
}
