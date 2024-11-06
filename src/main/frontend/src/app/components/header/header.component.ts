import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [

    CommonModule,
    RouterModule,
    MATERIAL_MODULES,

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isAuthenticated: boolean = false;  // Define si el usuario está autenticado
  userRole: string = 'guest';        // Define el rol del usuario ('guest' como valor por defecto)

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.updateUserStatus();
  }

  // Actualiza el estado de autenticación y el rol
  updateUserStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated(); // Verifica autenticación
    this.userRole = this.authService.getUserRole();           // Obtiene el rol
  }

  // Cierra sesión y redirige a la página principal
  logout(): void {
    this.authService.logout();
    this.updateUserStatus();          // Actualiza el estado tras logout
    this.router.navigate(['/']);       // Redirige a la página de inicio
  }
}
