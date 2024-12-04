import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { AdService } from '../../services/ad.service';
import { MATERIAL_MODULES } from '../material/material.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [MATERIAL_MODULES,RouterModule,CommonModule,FormsModule],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  userRole = 'guest';
  isSmallScreen = false;
  searchQuery = ''; // Consulta de búsqueda

  constructor(private adService: AdService,private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(userSession => {
      this.isAuthenticated = !!userSession;
      this.userRole = userSession?.roles[0] || 'guest';
    });

    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 768;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Método para manejar la búsqueda
  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Realizando búsqueda para:', this.searchQuery);
      // Aquí puedes llamar un método de AuthService o realizar navegación
      this.adService.someSearchMethod(this.searchQuery).subscribe({
        next: (results) => {
          console.log('Resultados de búsqueda:', results);
          this.router.navigate(['/search-results'], { queryParams: { q: this.searchQuery } });
        },
        error: (err) => console.error('Error en la búsqueda:', err),
      });
    } else {
      console.warn('La búsqueda está vacía');
    }
  }
}
