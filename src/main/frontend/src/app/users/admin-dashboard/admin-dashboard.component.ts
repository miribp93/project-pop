import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    CommonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users?: User[];
  public totalLength = 0;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {

    //Carga todos los usuarios
    this.authService.findAll().subscribe(
      (user) => {
        console.log('Datos recibidos:', user);
        this.users = user || [];
        //this.totalLength = this.users.length;
      },
      (error) => console.error('Error en la carga de datos:', error)
    );
  }

  //Cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
  //Eliminar Usuario
  deleteUser(userId: number): void {
    // Lógica para borrar usuario
    this.authService.delete(userId).subscribe(
      () => {
        alert('Cuenta eliminada con éxito');
        this.users = this.users?.filter(user => user.id_user !== userId);
      },
      (error) => console.error('Error al eliminar usuario:', error)
    );
  }
  //Bloquear o desbloquear usuario
  toggleBlockUser(user: User): void {
    // Cambia el estado de bloqueo del usuario
    user.isBlocked = !user.isBlocked;

    // Aquí se llamaría al servicio para actualizar el estado del usuario en el backend
    this.authService.updateUserStatus(user.id_user, user.isBlocked).subscribe(
      () => {
        const action = user.isBlocked ? 'bloqueado' : 'desbloqueado';
        alert(`El usuario ha sido ${action}`);
      },
      (error: any) => console.error('Error al actualizar el estado del usuario:', error)
    );
  }
}
