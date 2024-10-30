// anuncios.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Anuncio } from '../../interfaces/anuncio.interfaces';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    MatCardModule,
    MatDividerModule,
    RouterModule,
    MatIconModule
  ],
  providers: [DataService],
})
export class AnunciosComponent implements OnInit {
  public anuncios: Anuncio[] = [];
  public categoria!: string;
  public anuncioPorId!: Anuncio | undefined; // Variable para almacenar el anuncio específico

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.categoria = params['categoria'];
      this.getAnuncios();

      const id = params['id']; // Obtener el ID de los parámetros de la ruta
      if (id) {
        this.getAnuncioById(id); // Llamar al método para obtener el anuncio por ID
      }
    });
  }

  getAnuncios() {
    const categoriaFormatted = this.capitalizeFirstLetter(this.categoria);  // Capitaliza la primera letra
    console.log('Categoría seleccionada:', categoriaFormatted);

    if (categoriaFormatted === 'Producto') {
      this.dataService.getAnunciosByCategoria('Producto').subscribe(anuncios => {
        this.anuncios = anuncios;
      });
    } else if (categoriaFormatted === 'Servicio') {
      this.dataService.getAnunciosByCategoria('Servicio').subscribe(anuncios => {
        this.anuncios = anuncios;
      });
    } else if (['Perro', 'Gato', 'Aves', 'Reptiles', 'Exoticos', 'Otros'].includes(categoriaFormatted)) {
      console.log('URL para tipo de animal:', categoriaFormatted);
      this.dataService.getAnunciosByAnimal(categoriaFormatted).subscribe(anuncios => {
        console.log('Anuncios por animal:', anuncios);  // Verifica si obtienes los anuncios
        this.anuncios = anuncios;
      });
    } else {
      this.anuncios = [];
    }
  }

  // Método para obtener un anuncio por ID
  getAnuncioById(id: string) {
    this.dataService.getAnuncioById(id).subscribe(anuncio => {
      this.anuncioPorId = anuncio; // Almacenar el anuncio en la variable
      console.log('Anuncio obtenido por ID:', this.anuncioPorId); // Verificar si se obtiene el anuncio
    });
  }

  capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
