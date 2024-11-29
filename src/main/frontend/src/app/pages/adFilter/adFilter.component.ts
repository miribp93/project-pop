import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdService } from '../../services/ad.service';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { NotificationService } from '../../services/notification.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-adFilter',
  templateUrl: './adFilter.component.html',
  styleUrls: ['./adFilter.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    CardComponent,
    MATERIAL_MODULES
  ],
  providers: [AdService],
})
export class AdFilterComponent implements OnInit {
  public ads: Ad[] = [];  // Lista completa de ads
  public paginaAds: Ad[] = [];  // Lista de ads paginados
  public categoria!: string;
  public tipoAd!: string;
  public AdPorId!: Ad | undefined;
  public photos: any[] = []; // Almacena las fotos obtenidas para el anuncio

  // Variables de paginación
  public pageSize = 8;
  public pageIndex = 0;
  public totalLength = 0;
  public ordenCriterio: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;  // Referencia al paginator

  constructor(
    private activatedRoute: ActivatedRoute,
    private adService: AdService,
  ) {}

  ngOnInit(): void {
    this.applyFilters(); // Aplica los filtros al inicializar el componente
  }

  // Método para aplicar filtros dinámicos basados en los parámetros de la URL
  applyFilters(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.categoria = params['categoria'];
      this.tipoAd = params['tipo'];
      const idAd = params['id'];

      if (idAd) {
        this.getAdWithPhotos(idAd); // Carga un anuncio completo con fotos si hay ID
      } else if (this.categoria && this.tipoAd) {
        this.getAdsByTypeAndCategory(this.tipoAd, this.categoria); // Filtrar por tipo y categoría
      } else if (this.categoria) {
        this.getAdsByCategory(this.categoria); // Filtrar solo por categoría
      } else if (this.tipoAd) {
        this.getAdsByType(this.tipoAd); // Filtrar solo por tipo
      } else {
        this.getAllAds(); // Carga todos los anuncios si no hay filtros
      }
    });
  }

  // Método para obtener todos los anuncios
  getAllAds(): void {
    this.adService.getAllAds().subscribe(ads => {
      this.ads = ads;
      this.totalLength = ads.length;
      this.setPaginatedAds();
      this.loadPhotosForAds(ads); // Cargar las fotos para los anuncios
    });
  }

  // Método para obtener anuncios por categoría
  getAdsByCategory(category: string): void {
    this.adService.getAdsByCategory(category).subscribe(ads => {
      this.ads = ads;
      this.totalLength = ads.length;
      this.setPaginatedAds();
      this.loadPhotosForAds(ads); // Cargar las fotos para los anuncios
    });
  }

  // Método para obtener anuncios por tipo
  getAdsByType(typeAd: string): void {
    this.adService.getAdsByType(typeAd).subscribe(ads => {
      this.ads = ads;
      this.totalLength = ads.length;
      this.setPaginatedAds();
      this.loadPhotosForAds(ads); // Cargar las fotos para los anuncios
    });
  }

  // Método para obtener anuncios por tipo y categoría
  getAdsByTypeAndCategory(typeAd: string, category: string): void {
    this.adService.getAdsByTypeAndCategory(typeAd, category).subscribe(ads => {
      this.ads = ads;
      this.totalLength = ads.length;
      this.setPaginatedAds();
      this.loadPhotosForAds(ads); // Cargar las fotos para los anuncios
    });
  }

  // Método para obtener un anuncio completo por ID junto con las fotos
  getAdWithPhotos(idAd: number): void {
    forkJoin({
      ad: this.adService.getAdComplete(idAd), // Obtener anuncio completo
      photos: this.adService.getAdPhoto(idAd), // Obtener fotos del anuncio
    }).subscribe({
      next: ({ ad, photos }) => {
        this.AdPorId = ad;
        this.photos = photos || []; // Asignar las fotos obtenidas
        console.log('Anuncio completo con fotos:', this.AdPorId, this.photos);
      },
      error: (err) => {
        console.error('Error fetching the ad or photos:', err);
      },
    });
  }

  // Cargar fotos para los anuncios filtrados
  loadPhotosForAds(ads: Ad[]): void {
    ads.forEach(ad => {
      if (ad.id_ad) {
        this.adService.getAdPhoto(ad.id_ad).subscribe(photos => {
          ad.photos = photos || []; // Asigna las fotos al anuncio
        });
      } else {
        console.error('El ID del anuncio es undefined:');
      }
    });
  }


  // Configura los anuncios que se mostrarán en la página actual
  setPaginatedAds(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginaAds = this.ads.slice(startIndex, endIndex);
  }

  // Maneja el cambio de página o tamaño de página
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.setPaginatedAds();
  }

  // Método para ordenar los anuncios
  ordenarAnuncios(event: any): void {
    const criterio = event.target.value;
    this.ordenCriterio = criterio;

    if (criterio === 'fecha') {
      this.ads.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    } else if (criterio === 'precio') {
      this.ads.sort((a, b) => a.price - b.price);
    } else if (criterio === 'nombre') {
      this.ads.sort((a, b) => a.title.localeCompare(b.title));
    }

    this.setPaginatedAds();
  }
}
