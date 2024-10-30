import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { MatListModule } from '@angular/material/list';
import { Anuncio } from '../../interfaces/anuncio.interfaces';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataService } from '../../services/data.service';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-anonces',
  standalone: true,
  imports: [
    CardComponent,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './anonces.component.html',
  styleUrl: './anonces.component.css',
  providers: [DataService],
})
export class AnoncesComponent implements OnInit {
  public anun?: Anuncio;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.dataService.getAnuncioById(id)))
      .subscribe({
        next: (anun) => {
          if (!anun) {
            // Manejo si no encuentra el anuncio, muestra mensaje en lugar de redirigir.
            alert('Anuncio no encontrado');
          }
          this.anun = anun;
        },
        error: (err) => {
          // Manejo de errores de la API
          console.error('Error fetching the ad', err);
        },
      });
  }
  regresar():void {
    this.router.navigateByUrl('home')
  }

  comprar(){
    this.router.navigateByUrl('contacto')
}
}
