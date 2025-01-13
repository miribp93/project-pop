import { Component, OnInit, ViewChild } from '@angular/core';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { CardComponent } from '../../components/card/card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, MATERIAL_MODULES],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AdService, AuthService],
})
export class HomeComponent implements OnInit {
  public ads: Ad[] = [];
  public paginatedProd: Ad[] = [];
  public pageSize = 12;
  public pageIndex = 0;
  public totalLength = 0;
  public ordenCriterio: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private adService: AdService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adService.getAllAds().subscribe(
      (ads) => {
        console.log('Datos recibidos:', ads);
        const adRequests = ads.map((ad) =>
          this.adService.getAdPhoto(ad.id_ad).pipe(
            map((photos) => ({
              ...ad,
              photos: photos.length > 0 ? [photos[0]] : [] // Solo tomar la primera foto, o un array vacío si no hay fotos
            }))
          )
        );

        // Combina todas las llamadas a fotos
        forkJoin(adRequests).subscribe(
          (adsWithPhotos) => {
            this.ads = adsWithPhotos;
            this.totalLength = this.ads.length;
            this.setPaginatedProducts();
          },
          (error) => console.error('Error al cargar fotos:', error)
        );
      },
      (error) => console.error('Error en la carga de datos:', error)
    );
  }

  vender(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/profile');
    } else {
      // Redirigir al login con queryParams indicando el producto y la ruta de redirección
      this.router.navigate(['/login'], {});
    }
  }

  ordenarAnuncios(criterio: string): void {
    console.log('Ordenando por:', criterio); // Depuración

    this.ordenCriterio = criterio; // Guardar el criterio para referencia

    if (criterio === 'fecha') {
      this.ads.sort((a, b) => +new Date(b.id_ad) - +new Date(a.id_ad)); // Ordenar por fecha de acuerdo al id descendente
    } else if (criterio === 'precio') {
      this.ads.sort((a, b) => a.price - b.price); // Ordenar por precio
    } else if (criterio === 'nombre') {
      this.ads.sort((a, b) => a.title.localeCompare(b.title)); // Ordenar alfabéticamente
    }

    this.setPaginatedProducts(); // Actualizar los productos paginados
  }

  setPaginatedProducts(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProd = this.ads.slice(startIndex, endIndex); // Segmento de productos a mostrar
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.setPaginatedProducts(); // Actualizar los productos paginados
  }

  infoventa(): void {
        this.router.navigateByUrl('/infoventa');
  }
}
