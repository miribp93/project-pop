import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { Anuncio } from '../../interfaces/anuncio.interfaces';
import { CardComponent } from '../../components/card/card.component';
import {MatPaginator,PageEvent,} from '@angular/material/paginator';
import { MATERIAL_MODULES } from '../../material/material/material.component';

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
  providers: [DataService],
})
export class HomeComponent implements OnInit {
  public prod: Anuncio[] = []; // Lista completa de productos
  public paginatedProd: Anuncio[] = []; // Lista de productos paginados
  public pageSize = 12; // Tamaño de la página (productos por página)
  public pageIndex = 0; // Índice de la página actual
  public totalLength = 0; // Total de productos

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined; // Referencia al paginator

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Cargar los anuncios desde el servicio
    this.dataService.getAnuncios().subscribe(
      (prod) => {
        console.log('Datos recibidos:', prod);
        this.prod = prod;
        this.totalLength = this.prod.length; // Total de productos
        this.setPaginatedProducts(); // Establecer productos paginados
      },
      (error) => console.error('Error en la carga de datos:', error)
    );
  }

  // Establece los productos que se mostrarán según la página actual y tamaño
  setPaginatedProducts(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProd = this.prod.slice(startIndex, endIndex); // Segmento de productos a mostrar
  }

  // Método que maneja el cambio de página y tamaño de página
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.setPaginatedProducts(); // Actualizar los productos paginados
  }
}
