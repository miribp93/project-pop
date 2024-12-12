import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from "../../components/card/card.component";
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent
  ],
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  results: any[] = [];
  isLoading = false;
  keyword: string | null = null;

  constructor(private route: ActivatedRoute, private adService: AdService) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de consulta
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'];
      if (this.keyword) {
        this.searchAds(this.keyword);
      }
    });
  }

  searchAds(keyword: string): void {
    this.isLoading = true;
    this.adService.searchAds(keyword).subscribe({
      next: (ads) => {
        console.log('Datos de los anuncios:', ads);

        // Aquí mapeamos cada anuncio para obtener las fotos
        const adRequests = ads.map((ad) =>
          this.adService.getAdPhoto(ad.id_ad).pipe(
            map((photos) => ({
              ...ad,
              photos: photos.length > 0 ? [photos[0]] : [] // Solo tomar la primera foto si existe, o un array vacío si no hay fotos
            }))
          )
        );

        // Combina todas las llamadas a fotos de los anuncios
        forkJoin(adRequests).subscribe(
          (adsWithPhotos) => {
            this.results = adsWithPhotos;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error al cargar fotos:', error);
            this.isLoading = false;
          }
        );
      },
      error: (err) => {
        console.error('Error al buscar:', err);
        this.isLoading = false;
      }
    });
  }
}
