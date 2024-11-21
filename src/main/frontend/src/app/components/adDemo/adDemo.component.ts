import { Component, OnInit } from '@angular/core';
import { AdService } from '../../services/ad.service';
import { Router } from '@angular/router';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { MATERIAL_MODULES } from '../material/material.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adDemo',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule],
  templateUrl: './adDemo.component.html',
  styleUrls: ['./adDemo.component.css'] // Cambiado a `styleUrls`
})
export class AdDemoComponent implements OnInit {
  public ads?: Ad[] = [];

  constructor(private dataService: AdService, private router: Router) {}

  ngOnInit() {
    this.findAdAll();
  }

  findAdAll() {
    this.dataService.getAllAds().subscribe(
      (ads) => {
        this.ads = ads;
        console.log('Conexión a la base de datos exitosa. Anuncios obtenidos:', ads);
      },
      (error) => console.log('Error tipo:', error)
    );
  }

  // Convertimos fotos en base64 a una URL de imagen
  getImageUrl(base64Data: string): string {
    if (base64Data) {
      if (!base64Data.startsWith('data:image')) {
        base64Data = `data:image/jpeg;base64,${base64Data}`;
      }
      return base64Data;
    }
    return ''; // Retorna cadena vacía si `base64Data` es nulo o no válido
  }

  deleteAnonce(id_ad: number): void {
    this.dataService.deleteAd(id_ad).subscribe(
      () => {
        alert('Anuncio eliminado con éxito');
        // Actualizar la lista después de eliminar
        this.ads = this.ads?.filter((ad) => ad.id_ad !== id_ad);
      },
      (error) => console.error('Error al eliminar Anuncio:', error)
    );
  }
}
