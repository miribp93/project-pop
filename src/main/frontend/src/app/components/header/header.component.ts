import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from '../material/material.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MATERIAL_MODULES,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;  // Define si el usuario está autenticado
  userRole = 'guest';       // Define el rol del usuario ('guest' como valor por defecto)
  isSmallScreen = false;    // Define si la pantalla es pequeña
  username: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}



  ngOnInit(): void {
    this.authService.user$.subscribe(userSession => {
      this.isAuthenticated = !!userSession;
      this.userRole = userSession?.roles[0] || 'guest';
      this.username = userSession?.username || null;
    });

    this.checkScreenSize(); // Check the screen size on initialization

  }

  // Escucha el evento de redimensionamiento de ventana para actualizar el tamaño de pantalla
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  // Verifica si la pantalla es pequeña
  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 768;
  }


  // Cierra sesión y redirige a la página principal
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirige a la página de inicio
  }
}
