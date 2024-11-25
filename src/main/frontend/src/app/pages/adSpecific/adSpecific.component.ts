import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { AdService } from '../../services/ad.service';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../components/material/material.component';

@Component({
  selector: 'app-adSpecific',
  standalone: true,
  imports: [
    CommonModule,
    MATERIAL_MODULES
  ],
  templateUrl: './adSpecific.component.html',
  styleUrls: ['./adSpecific.component.css'],
  providers: [AdService],
})
export class AdSpecificComponent implements OnInit {
  public anun?: Ad; // Contiene los datos del anuncio
  public isLoading: boolean = true; // Controla el spinner
  public errorMessage: string = ''; // Mensaje de error para el usuario

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adService: AdService,
    private authService: AuthService // Servicio para autenticación
  ) {}

  ngOnInit(): void {
    this.loadAd(); // Inicializa la carga del anuncio
  }

  /**
   * Método para cargar el anuncio desde el servicio.
   */
  private loadAd(): void {
    this.isLoading = true;
    this.errorMessage = ''; // Limpia el estado anterior de errores

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.adService.getAdComplete(+id)) // Convierte el `id` a número
      )
      .subscribe({
        next: (anun) => {
          this.isLoading = false; // Detiene el spinner
          if (!anun) {
            this.errorMessage = 'Anuncio no encontrado.';
            this.router.navigateByUrl('home'); // Navega a `home` si no encuentra el anuncio
          } else {
            this.anun = anun;
          }
        },
        error: (err) => {
          this.isLoading = false; // Detiene el spinner
          this.errorMessage = 'Hubo un problema al cargar el anuncio. Por favor, intenta de nuevo.';
          console.error('Error fetching the ad:', err);
        },
      });
  }

  /**
   * Método para intentar cargar el anuncio de nuevo.
   */
  public retryLoad(): void {
    this.loadAd();
  }

  /**
   * Navega de regreso a la página principal.
   */
  regresar(): void {
    this.router.navigateByUrl('home');
  }

  /**
   * Maneja la acción de "Comprar" verificando autenticación.
   */
  comprar(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('pay'); // Redirigir a la plataforma de pago si está logueado
    } else {
      // Redirigir al login con queryParams indicando el producto y la ruta de redirección
      this.router.navigate(['/login'], {
        queryParams: { redirect: 'pay', productId: this.anun?.idAd }
      });
    }
  }
}
