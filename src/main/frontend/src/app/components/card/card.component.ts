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
  @Input()

  ad: Ad | undefined;

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

    console.log('CardComponent destruido');
  }
}
