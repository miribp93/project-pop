import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MATERIAL_MODULES } from '../../components/material/material.component';
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
export class LoginComponent implements OnInit {

  usuario: string = '';
  password: string = '';
  redirectTo: string | null = null;
  productId: string | null = null;
  showPassword = false;  // Controla la visibilidad de la contraseña


  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de consulta en la inicialización del componente
    this.route.queryParamMap.subscribe(params => {
      this.redirectTo = params.get('redirect');
      this.productId = params.get('productId');
    });
  }

  // Alterna la visibilidad del campo de contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.authService.login(this.usuario, this.password).subscribe(
      response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);

          // Si `redirectTo` y `productId` están definidos, redirige a la página de pago
          if (this.redirectTo === 'pay' && this.productId) {
            this.router.navigate(['/pay'], { queryParams: { productId: this.productId } });
          } else {
            // Redirigir a una página predeterminada si no hay parámetros
            this.router.navigate(['/home']);
          }
        } else {
          alert('Inicio de sesión exitoso, pero no se recibió un token.');
        }
      },
      error => {
        console.error('Error en el inicio de sesión', error);
        alert('Usuario o contraseña incorrectos');
      }
    );
  }

  onForgotPassword(): void {
    this.router.navigate(['/forgotpass']);
  }
}
