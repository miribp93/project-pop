import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anonces-demo',
  standalone: true,
  imports: [MATERIAL_MODULES,
    CommonModule
  ],
  templateUrl: './anonces-demo.component.html',
  styleUrl: './anonces-demo.component.css'
})
export class AnoncesDemoComponent implements OnInit{

public ads?: Ad[]  = [];

  constructor(private dataService : DataService,
              private router :Router
  ){}


  ngOnInit(){

    this.findAnonces();
  }

  findAnonces() {
    this.dataService.getAnonces().subscribe(
      (ads) => {
        this.ads = ads;
        console.log("Conexión a la base de datos exitosa. Anuncios obtenidos:", ads);
      },
      (error) => console.log("Error tipo:", error)
    );
  }




}
