import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../material/material/material.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, MATERIAL_MODULES],
  providers: [DataService],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  usuario: User | null = null; // Datos del usuario
  anuncios: any[] = []; // Anuncios del usuario

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar datos del usuario
    this.authService.getCurrentUser().subscribe(
      (user) => (this.usuario = user),
      (error) => console.error('Error al cargar usuario:', error)
    );

    // Cargar anuncios del usuario
    this.loadAnuncios();
  }

  loadAnuncios(): void {
    // Aquí deberías implementar la lógica para cargar los anuncios del usuario
    // Puedes usar el `DataService` o algún servicio específico para anuncios
    this.dataService.getAnuncios().subscribe(
      (anuncios) => (this.anuncios = anuncios),
      (error) => console.error('Error al cargar anuncios:', error)
    );
  }

  modificarDatos(): void {
    // Redirige al formulario de registro en modo edición
    this.router.navigate(['/register'], { queryParams: { editMode: true } });
  }

  deleteUser(): void {
    // Lógica para borrar usuario
    this.authService.delete(this.usuario!.id_user.toString()).subscribe(
      () => {
        alert('Cuenta eliminada con éxito');
        this.router.navigate(['/home']); // Redirigir al home tras eliminar
      },
      (error) => console.error('Error al eliminar usuario:', error)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir al login tras logout
  }

  // FATA POR CREAR
  /*
  crearAnuncio(): void {
    // Lógica para crear un anuncio
    console.log('Crear anuncio');
  }

  modificarAnuncio(anuncioId: number): void {
    // Lógica para modificar el anuncio específico
    console.log(`Modificar anuncio ${anuncioId}`);
  }


borrarAnuncio(anuncioId: number): void {
    // Lógica para borrar el anuncio específico
    this.dataService.deleteAnuncio(anuncioId).subscribe(
      () => this.loadAnuncios(), // Recargar anuncios tras eliminar
      error => console.error('Error al eliminar anuncio:', error)
    );
  }*/
}
