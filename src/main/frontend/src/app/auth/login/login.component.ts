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

  constructor(private AuthService: AuthService, private router: Router) {}

  // Método para manejar el inicio de sesión
 onLogin(): void {
   /*  this.AuthService.login(this.usuario, this.password).subscribe(
      response => {
        // Redirigir si el login es exitoso
        this.router.navigate(['/home']);
      },
      error => {
        // Manejo de errores
        console.error('Error en el inicio de sesión', error);
        alert('Usuario o contraseña incorrectos');
      }
    );*/
  }
}
