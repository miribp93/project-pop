import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

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
    private route: ActivatedRoute,
    private alert: NotificationService
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
          // El rol ya se guarda en localStorage en el método login del AuthService

          // Obtener el rol desde el localStorage
          const userRole = this.authService.getUserRole();

          // Verificar si el usuario tiene el rol "Bloqueado"
          if (userRole === 'BLOCKED') {
            this.alert.show('Usuario Bloqueado');
            // Limpiar el almacenamiento para evitar accesos no autorizados
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            this.router.navigate(['/home']);
            return; // Salir del método
          }

          // Si el usuario no está bloqueado, redirigir según la lógica de negocio
          if (this.redirectTo === 'pay' && this.productId) {
            this.router.navigate(['/pay'], { queryParams: { productId: this.productId } });
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          this.alert.show('Inicio de sesión exitoso, pero no se recibió un token.');
        }
      },
      error => {
        console.error('Error en el inicio de sesión', error);
        this.alert.show('Usuario o contraseña incorrectos');

        this.password = '';
      }
    );
  }

  cancelar(){

      this.router.navigate(['/'])

  }

  onForgotPassword(): void {
    this.router.navigate(['/forgotpass']);
  }
}
