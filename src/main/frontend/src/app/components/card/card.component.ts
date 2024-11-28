import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../material/material.component';
import { Ad } from '../../interfaces/anuncio.interfaces';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    CommonModule,
    RouterModule,
  ],
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() ad: Ad | undefined; // Asegúrate de que la propiedad 'ad' es del tipo 'Ad'
  imageUrl: string | undefined; // Variable para almacenar la URL de la imagen principal

  /**
   * Lógica que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    // Verifica si existe 'ad' y si tiene fotos
    if (this.ad?.photos?.length) {
      // Asigna la URL de la primera foto al atributo 'imageUrl'
      //this.imageUrl = this.ad.photos[0].photos;
    } else {
      // Opcional: define una imagen por defecto si no hay fotos
      this.imageUrl = 'chango2.png';
    }
  }

  /**
   * Lógica que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    // Realiza la limpieza necesaria al destruir el componente
    console.log('CardComponent destruido');
  }
}
