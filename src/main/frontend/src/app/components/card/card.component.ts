import { Component, Input, OnInit } from '@angular/core';
  import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../material/material.component';
import { User } from '../../interfaces/user.interface';

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

   ad: any = {
    photos: [
      new Uint8Array([/* Aquí los datos binarios de tu imagen */])
    ]
  };
  imageUrl: string | undefined;


  ngOnInit(): void {
    if (this.ad.photos && this.ad.photos.length > 0) {
      this.imageUrl = this.getImageUrl(this.ad.photos[0]);
    }
  }

  getImageUrl(binaryData: Uint8Array): string {
    const blob = new Blob([binaryData], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }

  ngOnDestroy(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
 }


