import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { Anuncio } from '../../interfaces/anuncio.interfaces';
import { DataService } from '../../services/data.service';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../material/material/material.component';

@Component({
  selector: 'app-anonces',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    MATERIAL_MODULES

  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
  providers: [DataService],
})
export class productComponent implements OnInit {
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

            alert('Anuncio no encontrado');
          }
          this.anun = anun;
        },
        error: (err) => {

          console.error('Error fetching the ad', err);
        },
      });
  }
  regresar():void {
    this.router.navigateByUrl('home')
  }

  comprar(){
    //this.router.navigateByUrl('login')// crear un condicional que si esta logeado vaya directamente a la plataforma de pago sino redirige al login
    this.router.navigateByUrl('pay')
}
}


// comprar() {
//   if (this.authService.isLoggedIn()) {
//     // Si el usuario está logeado, lo rediriges a la pasarela de pago
//     this.router.navigateByUrl('pago');
//   } else {
//     // Si no está logeado, lo rediriges a la página de login
//     this.router.navigateByUrl('login');
//   }
