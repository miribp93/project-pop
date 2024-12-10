import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdService } from '../../services/ad.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { FormsModule } from '@angular/forms';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { PageEvent } from '@angular/material/paginator';
import { NotificationService } from '../../services/notification.service';
import { forkJoin, map } from 'rxjs';
import { UserAdCardComponent } from "../user-card/userCard.component";
;


@Component({
  selector: 'app-userProfile',
  standalone: true,
  imports: [CommonModule, FormsModule, MATERIAL_MODULES,UserAdCardComponent],
  providers: [AdService],
  templateUrl: './userProfile.component.html',
  styleUrls: ['./userProfile.component.css'],
})
export class UserProfileComponent implements OnInit {
  usuario: User | null = null;
  anuncios: any[] = [];
  selectedFile: File | null = null;
  photoPreview?: string | ArrayBuffer | null;
  isFileSelected: boolean = false;

  constructor(
    private authService: AuthService,
    private adService: AdService,
    private router: Router,
    private alert: NotificationService
  ) {
      // Enlace explícito de los métodos para asegurar el contexto
    this.modificarAnuncio = this.modificarAnuncio.bind(this);
    this.deleteAd = this.deleteAd.bind(this);
  }

  public ads: Ad[] = []; // Lista completa de productos
  public paginatedProd: Ad[] = []; // Lista de productos paginados
  public pageSize = 12; // Tamaño de la página (productos por página)
  public pageIndex = 0; // Índice de la página actual
  public totalLength = 0; // Total de productos

  ngOnInit(): void {
    // Cargar datos del usuario
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.usuario = user;
        if (user && user.profile_photo) {
          this.photoPreview = user.profile_photo;
        } else {
          this.loadProfilePhoto();  // Llamada explícita si no hay foto en los datos del usuario
        }
      },
      (error) => console.error('Error al cargar usuario:', error)
    );

    // Cargar anuncios del usuario
    this.loadAnuncios();
  }

  loadProfilePhoto(): void {
    this.authService.getProfilePhoto().subscribe(
      (photoBlob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.photoPreview = reader.result;
        };
        reader.readAsDataURL(photoBlob);
      },
      (error) => console.error('Error al cargar la foto de perfil:', error)
    );
  }


  modificarDatos(): void {
    this.router.navigate(['/register'], { queryParams: { editMode: true } });
  }

  deleteUser(): void {
    if (this.usuario) {
      this.authService.deleteUser().subscribe(
        () => {
          this.alert.show('Cuenta eliminada con éxito');
          this.router.navigate(['/home']);
        },
        (error) => console.error('Error al eliminar usuario:', error)
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.isFileSelected = true; // Asegura que el formulario de subida de foto sea visible

      const reader = new FileReader();
      reader.onload = () => (this.photoPreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }


  uploadPhoto(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.authService.uploadPhoto(formData).subscribe({
        next: (response) => {
          this.alert.show('Foto de perfil actualizada correctamente');
          if (response.photoUrl) {
            this.photoPreview = response.photoUrl;
            this.isFileSelected = false;

            // Recargar el usuario para obtener la foto actualizada
            this.authService.getCurrentUser().subscribe((user) => {
              this.usuario = user;
              this.photoPreview = user.profile_photo;

              location.reload();
            });
          }
        },
        error: (err) => this.alert.show('Error al subir la foto de perfil: ' + err.message),
      });
    }
  }


  // Mostrar el formulario para seleccionar archivo
  selectFile(): void {
    this.isFileSelected = !this.isFileSelected;
  }


//METODSOS PARA ANUNCIOS

  loadAnuncios(): void {
    this.adService.getMyAds().subscribe(
      (ads) => {
        console.log('Datos recibidos de anuncios privados:', ads);

        // Procesar cada anuncio para obtener sus fotos
        const adRequests = ads.map((ad) =>
          this.adService.getAdPhoto(ad.id_ad).pipe(
            map((photos) => ({
              ...ad,
              photos: photos.length > 0 ? [photos[0]] : [] // Solo tomar la primera foto o array vacío si no hay fotos
            }))
          )
        );

        // Combinar todas las llamadas de fotos
        forkJoin(adRequests).subscribe(
          (adsWithPhotos) => {
            this.ads = adsWithPhotos;
            this.totalLength = this.ads.length; // Total de productos
            this.setPaginatedProducts(); // Establecer productos paginados
          },
          (error) => console.error('Error al cargar fotos:', error)
        );
      },
      (error) => console.error('Error en la carga de datos:', error)
    );
  }



  userCreateAd() {

    this.router.navigate(['/usercreateads']);
  }

  modificarAnuncio(idAd: number): void {
    this.router.navigate(['/usercreateads'], { queryParams: { editMode: true } });
    console.log(`Modificar anuncio ${idAd}`);
  }

  deleteAd(idAd: number): void {

    this.adService.deleteAd(idAd).subscribe(
      () => {
        this.alert.show('Anucio eliminado con exito');
        this.loadAnuncios();

      },
      (error) => console.error('Error al eliminar usuario:', error)
    );
  }

  // Establece los productos que se mostrarán según la página actual y tamaño
  setPaginatedProducts(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProd = this.ads.slice(startIndex, endIndex); // Segmento de productos a mostrar
  }

  // Método que maneja el cambio de página y tamaño de página
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.setPaginatedProducts(); // Actualizar los productos paginados
  }
}


