import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdService } from '../../services/ad.service';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MATERIAL_MODULES } from '../../components/material/material.component';

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

  // Variables de paginación
  public pageSize = 8;  // Tamaño de la página (número de ads por página)
  public pageIndex = 0;  // Índice de la página actual
  public totalLength = 0;  // Total de ads

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;  // Referencia al paginator

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: AdService
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
        this.getAdComplete(idAd); // Carga un anuncio completo si hay ID
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
    this.dataService.getAllAds().subscribe(ads => {
      this.ads = ads;
      this.totalLength = ads.length;
      this.setPaginatedAds();
    });
  }

  // Método para obtener anuncios por categoría
  getAdsByCategory(category: string): void {
    this.dataService.getAdsByCategory(category).subscribe(ads => {
      this.ads = ads;
      this.totalLength = ads.length;
      this.setPaginatedAds();
    });
  }

  // Método para obtener anuncios por tipo
  getAdsByType(typeAd: string): void {
    this.dataService.getAdsByType(typeAd).subscribe(ads => {
      this.ads = ads;
      this.totalLength = ads.length;
      this.setPaginatedAds();
    });
  }

  // Método para obtener anuncios por tipo y categoría
  getAdsByTypeAndCategory(typeAd: string, category: string): void {
    this.dataService.getAdsByTypeAndCategory(typeAd, category).subscribe(ads => {
      this.ads = ads;
      this.totalLength = ads.length;
      this.setPaginatedAds();
    });
  }

  // Método para obtener un anuncio completo por ID
  getAdComplete(idAd: number): void {
    this.dataService.getAdComplete(idAd).subscribe(ad => {
      this.AdPorId = ad;
      console.log('Anuncio completo obtenido:', this.AdPorId);
    });
  }


  public ordenCriterio: string = '';

ordenarAnuncios(event: any): void {
  const criterio = event.target.value; // Obtener el criterio seleccionado
  this.ordenCriterio = criterio; // Guardar el criterio para referencia

  if (criterio === 'fecha') {
    this.ads.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)); // Ordenar por fecha
  } else if (criterio === 'precio') {
    this.ads.sort((a, b) => a.price - b.price); // Ordenar por precio
  } else if (criterio === 'nombre') {
    this.ads.sort((a, b) => a.title.localeCompare(b.title)); // Ordenar alfabéticamente
  }

  // Una vez ordenado, actualiza los productos paginados
  this.setPaginatedAds();
}





  // Configura los anuncios que se mostrarán en la página actual
  setPaginatedAds(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginaAds = this.ads.slice(startIndex, endIndex); // Segmenta los ads para la paginación
  }

  // Maneja el cambio de página o tamaño de página
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.setPaginatedAds(); // Actualiza la lista de ads paginados
  }
}

















// import { Component, OnInit, ViewChild } from '@angular/core';
// import { ActivatedRoute, RouterModule } from '@angular/router';
// import { AdService } from '../../services/ad.service';
// import { Ad } from '../../interfaces/anuncio.interfaces';
// import { CommonModule } from '@angular/common';
// import { CardComponent } from '../../components/card/card.component';

// import { MatPaginator, PageEvent } from '@angular/material/paginator';
// import { MATERIAL_MODULES } from '../../components/material/material.component';

// @Component({
//   selector: 'app-adFilter',
//   templateUrl: './adFilter.component.html',
//   styleUrls: ['./adFilter.component.css'],
//   standalone: true,
//   imports: [
//     RouterModule,
//     CommonModule,
//     CardComponent,
//     MATERIAL_MODULES

//   ],
//   providers: [AdService],
// })
// export class AdFilterComponent implements OnInit {

//   public ads: Ad[] = [];  // Lista completa de ads
//   public paginaAds: Ad[] = [];  // Lista de ads paginados
//   public categoria!: string;
//   public AdPorId!: Ad | undefined;

//   // Variables de paginación
//   public pageSize = 8;  // Tamaño de la página (número de ads por página)
//   public pageIndex = 0;  // Índice de la página actual
//   public totalLength = 0;  // Total de ads

//   @ViewChild(MatPaginator) paginator: MatPaginator | undefined;  // Referencia al paginator

//   constructor(
//     private activatedRoute: ActivatedRoute,
//     private dataService: AdService
//   ) {}


//   ngOnInit(): void {
//     this.activatedRoute.params.subscribe(params => {
//       this.categoria = params['categoria'];
//       this.getAdAll();

//       const id = params['id'];  // Obtener el ID de los parámetros de la ruta
//       if (id) {
//         this.getAdById(id);  // Llamar al método para obtener el Ad por ID
//       }
//     });
//   }



//   // Método para obtener todos los ads
//   getAdAll() {
//     const categoriaFormatted = this.capitalizeFirstLetter(this.categoria);
//     console.log('Categoría seleccionada:', categoriaFormatted);

//     if (categoriaFormatted === 'Producto') {
//       this.dataService.getAdsByCategoria('Producto').subscribe(ads => {
//         this.ads = ads;
//         this.totalLength = ads.length;  // Establece el número total de ads
//         this.setPaginatedAds();  // Configura los ads paginados
//       });
//     } else if (categoriaFormatted === 'Servicio') {
//       this.dataService.getAdsByCategoria('Servicio').subscribe(ads => {
//         this.ads = ads;
//         this.totalLength = ads.length;
//         this.setPaginatedAds();
//       });
//     } else if (['Perro', 'Gato', 'Aves', 'Reptiles', 'Exoticos', 'Otros'].includes(categoriaFormatted)) {
//       console.log('URL para tipo de animal:', categoriaFormatted);
//       this.dataService.getAdsByAnimal(categoriaFormatted).subscribe(ads => {
//         console.log('Ads por animal:', ads);
//         this.ads = ads;
//         this.totalLength = ads.length;
//         this.setPaginatedAds();
//       });
//     } else {
//       this.ads = [];
//       this.totalLength = 0;
//     }
//   }

//   // Método para obtener un Ad por ID
//   getAdById(id: string) {
//     this.dataService.getAdById(id).subscribe(Ad => {
//       this.AdPorId = Ad;
//       console.log('Ad obtenido por ID:', this.AdPorId);
//     });
//   }




//   // Configura los ads que se mostrarán en la página actual
//   setPaginatedAds() {
//     const startIndex = this.pageIndex * this.pageSize;
//     const endIndex = startIndex + this.pageSize;
//     this.paginaAds = this.ads.slice(startIndex, endIndex);  // Segmenta los ads para la paginación
//   }

//   // Maneja el cambio de página o tamaño de página
//   onPageChange(event: PageEvent) {
//     this.pageSize = event.pageSize;
//     this.pageIndex = event.pageIndex;
//     this.setPaginatedAds();  // Actualiza la lista de ads paginados
//   }

//   capitalizeFirstLetter(word: string): string {
//     return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//   }
// }
