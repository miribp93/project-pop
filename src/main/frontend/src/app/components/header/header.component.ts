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
  photoPreview: string | null = null; // Para almacenar la foto de perfil

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscripción al user$ para saber si el usuario está autenticado
    this.authService.user$.subscribe(userSession => {
      this.isAuthenticated = !!userSession;
      this.userRole = userSession?.roles[0] || 'guest';
      this.username = userSession?.username || null;

      // Obtener la foto de perfil utilizando el servicio AuthService
      if (userSession?.token) {
        this.authService.getProfilePhoto().subscribe(
          (photoBlob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              this.photoPreview = reader.result as string; // Convertimos el Blob en URL de imagen
            };
            reader.readAsDataURL(photoBlob); // Leemos el Blob como URL
          },
          (error) => {
            console.error('Error al cargar la foto de perfil', error);
          }
        );
      }
    });

    this.checkScreenSize(); // Verifica el tamaño de la pantalla al iniciar
  }
  onSearch(term: string, event: Event): void {
    event.preventDefault(); // Prevenir el reinicio de la página
    console.log(`Buscando el término: ${term}`);

    if (!term.trim()) {
      console.warn('El término de búsqueda está vacío.');
      return; // No realizar búsquedas vacías
    }

    // Redirigir a la página de resultados con el término de búsqueda
    this.router.navigate(['/search-result'], { queryParams: { keyword: term } });
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
