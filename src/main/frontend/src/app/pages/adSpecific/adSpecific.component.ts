import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Anuncio } from '../../interfaces/anuncio.interfaces';
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
  public anun?: Anuncio;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: AdService,
    private authService: AuthService // Inyectamos AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.dataService.getAnuncioById(id)))
      .subscribe({
        next: (anun) => {
          if (!anun) {
            alert('Anuncio no encontrado');
          }
          this.anun = anun;
        },
        error: (err) => {
          console.error('Error fetching the ad', err);
        },
      });
  }

  regresar(): void {
    this.router.navigateByUrl('home');
  }

  comprar(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('pay'); // Redirigir a la plataforma de pago si está logeado
    } else {
      // Redirigir al login con queryParams indicando el producto y la ruta de redirección
      this.router.navigate(['/login'], {
        queryParams: { redirect: 'pay', productId: this.anun?.id }
      });
    }
  }
}
