import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdService } from '../../services/ad.service';
import { Ad } from '../../interfaces/anuncio.interfaces';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-userAd',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule, ReactiveFormsModule,],
  templateUrl: './userAd.component.html',
  styleUrl: './userAd.component.css',
})
export class UserAdComponent {
  adForm!: FormGroup;
  //categories: string[] = ['Perro', 'Gato', 'Aves', 'Animales Exoticos']; // Ejemplo de categorías
  selectedFiles: File[] = [];
  editMode: boolean= false; // Cambia según el modo en el que estés , lo uso al igual que el formulario de registro , me redirige aqui si quiero modificar los datos del producto

  constructor(private fb: FormBuilder, private dataService: AdService, private router: Router) {}

  ngOnInit() {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      city: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', Validators.required],
      condition: ['', Validators.required],
    });
  }

  get f() {
    return this.adForm.controls;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onAdSubmit() {
    if (this.adForm.invalid) {
      return;
    }
    const ad: Ad = this.adForm.value;

    if (this.editMode) {
      // Si estamos en modo edición, actualizamos el perfil
      this.dataService.updateAd(ad).subscribe(
        (response) => {
          alert('Perfil actualizado exitosamente');
          this.router.navigate(['/user-profile']); // Redirige al perfil del usuario
        },
        (error) => {
          console.error('Error al actualizar el perfil', error);
          const errorMsg =
            error.error?.message || 'Error al actualizar el perfil';
          alert(errorMsg);
        }
      );
    } else {
    this.dataService.createAd(ad, this.selectedFiles).subscribe({
      next: (response) => {
        console.log('Anuncio creado:', response);
      },
      error: (error) => {
        console.error('Error al crear anuncio:', error);
      },
    });
  }
}
}
