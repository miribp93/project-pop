import { Component, Input, OnInit } from '@angular/core';
import { Anuncio } from '../../interfaces/anuncio.interfaces';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../material/material/material.component';

@Component({
  selector: 'productos-prod-card',
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
  public prod!: Anuncio;

  ngOnInit(): void {
    if (!this.prod) {
      console.warn('Producto no proporcionado al componente');
    }
  }
}
