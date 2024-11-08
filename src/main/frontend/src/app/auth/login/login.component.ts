import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MATERIAL_MODULES
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuario: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}


  onLogin(): void {

    this.authService.login(this.usuario, this.password).subscribe(
      response => {
        // Verificar si la respuesta contiene un token o algún indicador de éxito
        if (response && response.token) {
          // Almacenar el token en localStorage o sessionStorage
          localStorage.setItem('token', response.token);

          // Redirigir a la página de inicio o a la ruta deseada
           //window.location.reload();

          this.router.navigate(['/home']);

        } else {
          alert('Inicio de sesión exitoso, pero no se recibió un token.');
        }
      },
      error => {
        // Manejo de errores (por ejemplo, credenciales incorrectas)
        console.error('Error en el inicio de sesión', error);
        alert('Usuario o contraseña incorrectos');
      }
    );
  }

  onForgotPassword(): void {

    this.router.navigate(['/forgotpass']);
  }
}
