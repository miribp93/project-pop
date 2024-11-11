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
  imports: [RouterModule, CommonModule, FormsModule,MATERIAL_MODULES],
  providers: [DataService],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  usuario: User | null = null; // Datos del usuario
  anuncios: any[] = []; // Anuncios del usuario
  selectedFile: File | null = null;
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

  // Cargar la foto de perfil desde el servidor si no está disponible en los datos del usuario
loadProfilePhoto(): void {
  this.authService.getProfilePhoto().subscribe(
    (photoBlob) => {
      // Crear URL a partir del Blob
      const reader = new FileReader();
      reader.onloadend = () => {
        this.photoPreview = reader.result;  // Asigna la foto a la vista previa
      };
      reader.readAsDataURL(photoBlob);  // Convierte el Blob en una URL de imagen
    },
    (error) => console.error('Error al cargar la foto de perfil:', error)
  );
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

 // Evento para manejar la selección de archivo
 onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    this.selectedFile = fileInput.files[0];

    // Mostrar vista previa de la imagen
    const reader = new FileReader();
    reader.onload = () => (this.photoPreview = reader.result);
    reader.readAsDataURL(this.selectedFile);
  }
}

// Método para subir la foto
uploadPhoto(): void {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.authService.uploadPhoto(formData).subscribe({
      next: (response) => {
        alert("Foto de perfil actualizada correctamente");
        // Actualizar la vista previa con la URL de la nueva foto si es necesario
        if (response.photoUrl) {
          this.photoPreview = response.photoUrl;
        }
      },
      error: (err) => alert("Error al subir la foto de perfil: " + err.message),
    });
  }
}


  // Método para crear anuncio
  crearAnuncio(): void {
    // Lógica para crear un anuncio
    console.log('Crear anuncio');
  }
  // Método para modificar anuncio
  modificarAnuncio(anuncioId: number): void {
    // Lógica para modificar el anuncio específico
    console.log(`Modificar anuncio ${anuncioId}`);
  }
  // Método para eliminar anuncio
  eliminarAnuncio(anuncioId: number): void {
    // Lógica para borrar el anuncio específico
    console.log('Anuncio borrado');
  }
}
