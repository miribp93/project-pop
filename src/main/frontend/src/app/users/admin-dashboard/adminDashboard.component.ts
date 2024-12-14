import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../services/notification.service';
import { AdService } from '../../services/ad.service';

@Component({
  selector: 'app-adminDashboard',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    CommonModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  pagedUsers: User[] = []; // Usuarios para la página actual
  totalLength = 0;
  pageSize = 10; // Tamaño de página predeterminado
  pageIndex = 0;

  ads: any[] = []; // Lista de anuncios
  pagedAds: any[] = []; // Anuncios para la página actual
  showUsers = true; // Controla si se muestran usuarios o anuncios

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: NotificationService,
    private adService: AdService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Carga todos los usuarios
  loadUsers(): void {
    this.authService.getdAll().subscribe(
      (users) => {
        console.log('Datos de usuarios recibidos:', users);
        this.users = users || [];
        this.totalLength = this.users.length;
        this.updatePagedUsers(); // Inicializa los usuarios paginados
      },
      (error) => console.error('Error en la carga de usuarios:', error)
    );
  }

  // Carga todos los anuncios
  loadAds(): void {
    this.adService.getAllAds().subscribe(
      (ads) => {
        console.log('Datos de anuncios recibidos:', ads);
        this.ads = ads || [];
        this.totalLength = this.ads.length;
        this.updatePagedAds(); // Inicializa los anuncios paginados
      },
      (error) => console.error('Error en la carga de anuncios:', error)
    );
  }

  // Cambia entre usuarios y anuncios
  toggleView(showUsers: boolean): void {
    this.showUsers = showUsers;
    if (showUsers) {
      this.loadUsers();
    } else {
      this.loadAds();
    }
  }

  // Paginación de usuarios
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.showUsers) {
      this.updatePagedUsers();
    } else {
      this.updatePagedAds();
    }
  }

  private updatePagedUsers(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  private updatePagedAds(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedAds = this.ads.slice(startIndex, endIndex);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  deleteUserAdmin(userId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.authService.deleteUserAdmin(userId).subscribe(
        () => {
          this.alert.show('Cuenta eliminada con éxito');
          this.users = this.users.filter(user => user.id_user !== userId);
          this.totalLength = this.users.length; // Actualiza el total
          this.updatePagedUsers(); // Actualiza los usuarios en pantalla
        },
        (error) => console.error('Error al eliminar usuario:', error)
      );
    }
  }

  deleteAdAdmin(id_ad: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
      this.adService.deleteAdAdmin(id_ad).subscribe(
        () => {
          this.alert.show('Anuncio eliminado con éxito');
          this.ads = this.ads.filter(ad => ad.id_ad !== id_ad);
          this.totalLength = this.ads.length; // Actualiza el total
          this.updatePagedAds(); // Actualiza los anuncios en pantalla
        },
        (error: any) => console.error('Error al eliminar anuncio:', error)
      );
    }
  }

  BlockUser(user: User): void {
    if (user.roles === 'BLOCKED') {
      this.authService.unblockUser(user.id_user).subscribe(
        () => {
          user.roles = 'USER'; // Cambia el rol a usuario normal tras desbloquear
          this.alert.show('El usuario ha sido desbloqueado');
        },
        (error: any) => console.error('Error al desbloquear el usuario:', error)
      );
    } else {
      this.authService.blockUser(user.id_user).subscribe(
        () => {
          user.roles = 'BLOCKED'; // Cambia el rol a bloqueado tras bloquear
          this.alert.show('El usuario ha sido bloqueado');
        },
        (error: any) => console.error('Error al bloquear el usuario:', error)
      );
    }
  }
}
