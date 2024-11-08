import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, MATERIAL_MODULES,FormsModule ],
  providers: [DataService],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  usuario: User | null = null; // Datos del usuario
  anuncios: any[] = []; // Anuncios del usuario
  selectedFile?: File; // Archivo seleccionado para la foto de perfil
  photoPreview?: string | ArrayBuffer | null; // Vista previa de la foto

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar datos del usuario
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.usuario = user;
        if (user.profile_photo) {
          this.photoPreview = user.profile_photo; // Asignar URL de la foto de perfil a photoPreview
          console.log('URL de la foto de perfil:', this.photoPreview);
        }
      },
      (error) => console.error('Error al cargar usuario:', error)
    );

    // Cargar anuncios del usuario
    this.loadAnuncios();
  }

  // Cargar todos los anuncios del usuario
  loadAnuncios(): void {
    this.dataService.getAnuncios().subscribe(
      (anuncios) => (this.anuncios = anuncios),
      (error) => console.error('Error al cargar anuncios:', error)
    );
  }

  // Modifica datos y redirige al formulario de registro en modo edición
  modificarDatos(): void {
    this.router.navigate(['/register'], { queryParams: { editMode: true } });
  }

  // Elimina cuenta
  deleteUser(): void {
    // Lógica para borrar usuario - dar de baja cuenta
    if (this.usuario) {
      this.authService.delete(this.usuario.id_user.toString()).subscribe(
        () => {
          alert('Cuenta eliminada con éxito');
          this.router.navigate(['/home']); // Redirigir al home tras eliminar
        },
        (error) => console.error('Error al eliminar usuario:', error)
      );
    }
  }

  // Cierra sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir al login tras logout
  }

  // Método para manejar la selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Método para subir la foto al backend
  uploadPhoto(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('photo', this.selectedFile);

      // Llamada al servicio para subir la foto
      this.authService.uploadPhoto(formData).subscribe(
        (response) => {
          alert('Foto subida con éxito');
          this.usuario!.profile_photo = response.photoUrl; // Actualiza la URL de la foto del usuario
        },
        (error) => console.error('Error al subir la foto:', error)
      );
    }
  }


  // FATA POR CREAR

  crearAnuncio(): void {
    // Lógica para crear un anuncio
    console.log('Crear anuncio');
  }

  modificarAnuncio(anuncioId: number): void {
    // Lógica para modificar el anuncio específico
    console.log(`Modificar anuncio ${anuncioId}`);
  }

  eliminarAnuncio(anuncioId: number): void {
    // Lógica para borrar el anuncio específico
    console.log('Anuncio borrado');
  }
}
