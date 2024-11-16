import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdService } from '../../services/ad.service';
import { Anuncio } from '../../interfaces/anuncio.interfaces';
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
  public anuncios: Anuncio[] = [];  // Lista completa de anuncios
  public paginaAnuncios: Anuncio[] = [];  // Lista de anuncios paginados
  public categoria!: string;
  public anuncioPorId!: Anuncio | undefined;

  // Variables de paginación
  public pageSize = 8;  // Tamaño de la página (número de anuncios por página)
  public pageIndex = 0;  // Índice de la página actual
  public totalLength = 0;  // Total de anuncios

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;  // Referencia al paginator

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: AdService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.categoria = params['categoria'];
      this.getAnuncios();

      const id = params['id'];  // Obtener el ID de los parámetros de la ruta
      if (id) {
        this.getAnuncioById(id);  // Llamar al método para obtener el anuncio por ID
      }
    });
  }

  // Método para obtener todos los anuncios
  getAnuncios() {
    const categoriaFormatted = this.capitalizeFirstLetter(this.categoria);
    console.log('Categoría seleccionada:', categoriaFormatted);

    if (categoriaFormatted === 'Producto') {
      this.dataService.getAnunciosByCategoria('Producto').subscribe(anuncios => {
        this.anuncios = anuncios;
        this.totalLength = anuncios.length;  // Establece el número total de anuncios
        this.setPaginatedAnuncios();  // Configura los anuncios paginados
      });
    } else if (categoriaFormatted === 'Servicio') {
      this.dataService.getAnunciosByCategoria('Servicio').subscribe(anuncios => {
        this.anuncios = anuncios;
        this.totalLength = anuncios.length;
        this.setPaginatedAnuncios();
      });
    } else if (['Perro', 'Gato', 'Aves', 'Reptiles', 'Exoticos', 'Otros'].includes(categoriaFormatted)) {
      console.log('URL para tipo de animal:', categoriaFormatted);
      this.dataService.getAnunciosByAnimal(categoriaFormatted).subscribe(anuncios => {
        console.log('Anuncios por animal:', anuncios);
        this.anuncios = anuncios;
        this.totalLength = anuncios.length;
        this.setPaginatedAnuncios();
      });
    } else {
      this.anuncios = [];
      this.totalLength = 0;
    }
  }

  // Método para obtener un anuncio por ID
  getAnuncioById(id: string) {
    this.dataService.getAnuncioById(id).subscribe(anuncio => {
      this.anuncioPorId = anuncio;
      console.log('Anuncio obtenido por ID:', this.anuncioPorId);
    });
  }




  // Configura los anuncios que se mostrarán en la página actual
  setPaginatedAnuncios() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginaAnuncios = this.anuncios.slice(startIndex, endIndex);  // Segmenta los anuncios para la paginación
  }

  // Maneja el cambio de página o tamaño de página
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.setPaginatedAnuncios();  // Actualiza la lista de anuncios paginados
  }

  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
