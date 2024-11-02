import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { DataService } from '../../services/data.service';
import { CardComponent } from '../../components/card/card.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    CardComponent,
    MATERIAL_MODULES
  ],
  providers: [DataService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent  {

  //La logica consiste en poder mostrar datos usuario y datos anuncios del usuario, modificar perfil, modificar anuncios y elminar aunucios


  constructor(private dataService: DataService) {}

  usuario = { //Cargar los datos del usuario
    nombre: 'Lucas Pagani',
    email: 'lucaspagani@hotmail.com',
    telefono: '+54 622941582'
  };

  modificarAnuncio(){

  }

  crearAnuncio() {
    // Lógica para crear un nuevo anuncio
  }

  borrarAnuncio() {
    // Lógica para borrar un anuncio
  }

}
