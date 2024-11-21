import { Component, Input, OnInit } from '@angular/core';
import { Ad, Anuncio } from '../../interfaces/anuncio.interfaces';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../material/material.component';

 @Component({
   selector: 'app-card',
   templateUrl: './card.component.html',
   standalone: true,
   imports: [
     MATERIAL_MODULES,
     CommonModule,
     RouterModule,
   ],
   styleUrl: './card.component.css',
 })
 export class CardComponent implements OnInit {
   @Input()

   public ad!: Ad;

   ngOnInit(): void {
     if (!this.ad) {
      console.warn('Producto no proporcionado al componente');
     }
   }
 }


