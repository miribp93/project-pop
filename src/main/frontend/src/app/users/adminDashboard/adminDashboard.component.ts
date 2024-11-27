import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-adminDashboard',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    CommonModule,
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

  constructor(private authService: AuthService, private router: Router,private alert: NotificationService) {}

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
        this.alert.show('Cuenta eliminada con éxito');
        this.users = this.users.filter(user => user.id_user !== userId);
        this.totalLength = this.users.length;  // Actualiza el total
        this.updatePagedUsers();  // Actualiza los usuarios en pantalla
      },
      (error) => console.error('Error al eliminar usuario:', error)
    );
  }

  BlockUser(user: User): void {
    if (user.roles === 'BLOCKED') {
      this.authService.unblockUser(user.id_user).subscribe(
        () => {
          user.roles = 'USER';  // Cambia el rol a usuario normal tras desbloquear
          this.alert.show('El usuario ha sido desbloqueado');
        },
        (error: any) => console.error('Error al desbloquear el usuario:', error)
      );
    } else {
      this.authService.blockUser(user.id_user).subscribe(
        () => {
          user.roles = 'BLOCKED';  // Cambia el rol a bloqueado tras bloquear
          this.alert.show('El usuario ha sido bloqueado');
        },
        (error: any) => console.error('Error al bloquear el usuario:', error)
      );
    }
  }

}
