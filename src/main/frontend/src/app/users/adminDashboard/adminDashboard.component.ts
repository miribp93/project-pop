import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-adminDashboard',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    CommonModule
  ],
  templateUrl: './adminDashboard.component.html',
  styleUrls: ['./adminDashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  pagedUsers: User[] = [];  // Usuarios para la página actual
  totalLength = 0;
  pageSize = 10;  // Tamaño de página predeterminado
  pageIndex = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getdAll().subscribe(
      (user) => {
        console.log('Datos recibidos:', user);
        this.users = user || [];
        this.totalLength = this.users.length;
        this.updatePagedUsers();  // Inicializa los usuarios paginados
      },
      (error) => console.error('Error en la carga de datos:', error)
    );
  }

  // Actualiza la lista de usuarios paginados al cambiar la página o el tamaño
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedUsers();
  }

  // Calcula y actualiza los usuarios que deben mostrarse en la página actual
  private updatePagedUsers(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  deleteUserAdmin(userId: number): void {
    this.authService.deleteUserAdmin(userId).subscribe(
      () => {
        alert('Cuenta eliminada con éxito');
        this.users = this.users.filter(user => user.id_user !== userId);
        this.totalLength = this.users.length;  // Actualiza el total
        this.updatePagedUsers();  // Actualiza los usuarios en pantalla
      },
      (error) => console.error('Error al eliminar usuario:', error)
    );
  }

  BlockUser(user: User): void {
    if (user.role === 'BLOQUEADO') {
      this.authService.unblockUser(user.id_user).subscribe(
        () => {
          user.role = 'USER';  // Rol de usuario normal tras desbloquear
          alert('El usuario ha sido desbloqueado');
        },
        (error: any) => console.error('Error al desbloquear el usuario:', error)
      );
    } else {
      this.authService.blockUser(user.id_user).subscribe(
        () => {
          user.role = 'BLOQUEADO';  // Rol bloqueado tras bloquear
          alert('El usuario ha sido bloqueado');
        },
        (error: any) => console.error('Error al bloquear el usuario:', error)
      );
    }
  }

}
