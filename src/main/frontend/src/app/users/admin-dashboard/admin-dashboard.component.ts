import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    CommonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  users?: User[];
  public totalLength = 0; // Total de productos


constructor(private AuthService : AuthService){}


  ngOnInit(): void {

    this.AuthService.findAll().subscribe(
      (user) => {
        console.log('Datos recibidos:', user);
        this.users = user;
        this.totalLength = this.users.length;
  },
  (error) => console.error('Error en la carga de datos:', error)
);

  }


}
