import { Component, OnInit, ViewChild } from '@angular/core';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { CardComponent } from '../../components/card/card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    MATERIAL_MODULES
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AdService, AuthService],
})
export class HomeComponent implements OnInit {
  public ads: Ad[] = []; // Lista completa de productos
  public paginatedProd: Ad[] = []; // Lista de productos paginados
  public pageSize = 12; // Tamaño de la página (productos por página)
  public pageIndex = 0; // Índice de la página actual
  public totalLength = 0; // Total de productos

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined; // Referencia al paginator

  constructor(private adService: AdService ,
              private authService: AuthService,
              private router:Router) {}

  ngOnInit(): void {
    this.adService.getAllAds().subscribe(
      (ads) => {
        console.log('Datos recibidos:', ads);
        this.ads = ads.map(ad => ({
          ...ad,
          photos: ad.photos || [] // Asegúrate de que photos siempre esté definido como array
        }));
        this.totalLength = this.ads.length;
        this.setPaginatedProducts();
      },
      (error) => console.error('Error en la carga de datos:', error)
    );
  }

  vender(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('pay'); // Redirigir a la plataforma de pago si está logueado
    } else {
      // Redirigir al login con queryParams indicando el producto y la ruta de redirección
      this.router.navigate(['/login'], {

      });
    }
  }




  // Establece los productos que se mostrarán según la página actual y tamaño
  setPaginatedProducts(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProd = this.ads.slice(startIndex, endIndex); // Segmento de productos a mostrar
  }

  // Método que maneja el cambio de página y tamaño de página
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.setPaginatedProducts(); // Actualizar los productos paginados
  }

  // // Función para ordenar los productos por fecha (más reciente primero)
  // ordenarPorFecha(): void {
  //   this.ads.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  //   this.setPaginatedProducts(); // Actualizar la paginación después de ordenar
  // }

  // // Función para ordenar los productos alfabéticamente
  // ordenarAlfabeticamente(): void {
  //   this.ads.sort((a, b) => a.nombre.localeCompare(b.nombre));
  //   this.setPaginatedProducts(); // Actualizar la paginación después de ordenar
  // }
}
