import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { AdService } from '../../services/ad.service';
import { AuthService } from '../../services/auth.service';
import { forkJoin, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../components/material/material.component';


@Component({
  selector: 'app-adSpecific',
  standalone: true,
  imports: [CommonModule, MATERIAL_MODULES],
  templateUrl: './adSpecific.component.html',
  styleUrls: ['./adSpecific.component.css'],
  providers: [AdService],
})
export class AdSpecificComponent implements OnInit {
  public anun?: Ad | undefined; // Contiene los datos del anuncio
  public isLoading: boolean = true; // Controla el spinner
  public errorMessage: string = ''; // Mensaje de error para el usuario

  public currentIndex: number = 0; // Índice de la imagen actual


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adService: AdService,
    private authService: AuthService // Servicio para autenticación
  ) {}

  ngOnInit(): void {
    this.loadAd(); // Inicializa la carga del anuncio
  }



  private loadAd(): void {
    this.isLoading = true;
    this.errorMessage = ''; // Limpia el estado anterior de errores

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          const adId = +id; // Convierte el `id` a número
          return forkJoin({
            ad: this.adService.getAdComplete(adId), // Obtiene el anuncio completo
            photos: this.adService.getAdPhoto(adId), // Obtiene las fotos del anuncio
          });
        })
      )
      .subscribe({
        next: ({ ad, photos }) => {
          this.isLoading = false; // Detiene el spinner
          if (!ad) {
            this.errorMessage = 'Anuncio no encontrado.';
            this.router.navigateByUrl('home'); // Navega a `home` si no encuentra el anuncio
          } else {
            this.anun = ad; // Asigna el anuncio
            this.anun.photos = photos || []; // Asigna las fotos obtenidas

            console.log('Anuncio cargado:', this.anun);
          }
        },
        error: (err) => {
          this.isLoading = false; // Detiene el spinner
          this.errorMessage =
            'Hubo un problema al cargar el anuncio. Por favor, intenta de nuevo.';
          console.error('Error fetching the ad or photos:', err);
        },
      });
  }



  public retryLoad(): void {
    this.loadAd();
  }

  regresar(): void {
    this.router.navigateByUrl('home');
  }

  comprar(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('pay'); // Redirigir a la plataforma de pago si está logueado
    } else {
      this.router.navigate(['/login'], {
        queryParams: { redirect: 'pay', productId: this.anun?.id_ad },
      });
    }
  }

    // Función para cambiar de imagen
    changeImage(direction: number): void {
      if (this.anun?.photos?.length) {
        this.currentIndex = (this.currentIndex + direction + this.anun.photos.length) % this.anun.photos.length;
      }
    }
}
