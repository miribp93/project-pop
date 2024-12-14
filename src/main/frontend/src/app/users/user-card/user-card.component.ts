import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { MATERIAL_MODULES } from '../../components/material/material.component';

@Component({
  selector: 'app-user-Card',
  templateUrl: './user-card.component.html',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    CommonModule,
  ],
  styleUrls: ['./user-card.component.css'],
})
export class UserAdCardComponent implements OnInit, OnDestroy {
  @Input() ad: Ad | undefined;
  @Input() onDeleteAd!: (adId: number) => void;
  @Input() onModifyAd!: (adId: number) => void;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    console.log('UserAdCardComponent destruido');
  }
}
