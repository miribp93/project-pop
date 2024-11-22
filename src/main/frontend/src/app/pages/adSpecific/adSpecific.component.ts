import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad,Anuncio } from '../../interfaces/anuncio.interfaces';
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
  styleUrl: './adSpecific.component.css',
  providers: [AdService],
})
export class AdSpecificComponent implements OnInit {
  public anun?: Ad;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adService: AdService,
    private authService: AuthService // Inyectamos AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.adService.getAdComplete(+id)) // Convierte el `id` a número
      )
      .subscribe({
        next: (anun) => {
          if (!anun) {
            alert('Anuncio no encontrado');
            this.router.navigateByUrl('home'); // Navega a `home` si no encuentra el anuncio
          } else {
            this.anun = anun;
          }
        },
        error: (err) => {
          console.error('Error fetching the ad:', err);
          alert('Hubo un error al cargar el anuncio');
          this.router.navigateByUrl('home'); // Navega a `home` si ocurre un error
        },
      });
  }

  regresar(): void {
    this.router.navigateByUrl('home');
  }

  comprar(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('pay'); // Redirigir a la plataforma de pago si está logueado
    } else {
      // Redirigir al login con queryParams indicando el producto y la ruta de redirección
      this.router.navigate(['/login'], {
        queryParams: { redirect: 'pay', productId: this.anun?.idAd}
      });
    }
  }
}
