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

@Component({
  selector: 'app-userProfile',
  standalone: true,
  imports: [CommonModule, FormsModule, MATERIAL_MODULES],
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
    private router: Router
  ) {}

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
          alert('Cuenta eliminada con éxito');
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
          alert('Foto de perfil actualizada correctamente');
          if (response.photoUrl) {
            this.photoPreview = response.photoUrl;
            this.isFileSelected = false;

            // Recargar el usuario para obtener la foto actualizada
            this.authService.getCurrentUser().subscribe((user) => {
              this.usuario = user;
              this.photoPreview = user.profile_photo; // Asume que `profile_photo` es la URL de la foto en los datos del usuario
            });
          }
        },
        error: (err) => alert('Error al subir la foto de perfil: ' + err.message),
      });
    }
  }


  // Mostrar el formulario para seleccionar archivo
  selectFile(): void {
    this.isFileSelected = !this.isFileSelected;
  }


//METODSOS PARA ANUNCIOS

  loadAnuncios(): void {
    this.adService.getAllAds().subscribe(
      (ads) => {
        console.log('Datos recibidos:', ads);
        this.ads = ads;
        this.totalLength = this.ads.length; // Total de productos
        this.setPaginatedProducts(); // Establecer productos paginados
      },
      (error) => console.error('Error en la carga de datos:', error)
    );
  }

  userAd(){
    this.router.navigate(['/usercreateads']);
  }

  modificarAnuncio(id_ad: number): void {
    this.router.navigate(['/usercreateads'], { queryParams: { editMode: true } });
    console.log(`Modificar anuncio ${id_ad}`);
  }

  eliminarAnuncio(anuncioId: number): void {
    console.log('Anuncio borrado');
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



