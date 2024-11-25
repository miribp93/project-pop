import { Component, OnInit } from '@angular/core';
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
export class UserAdComponent implements OnInit {
  adForm!: FormGroup;
  selectedFiles: File[] = [];
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adForm = this.fb.group({
      adType: ['', Validators.required], //fallo por que esta en otra tabla
      category: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      city: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: [''],
      condition: [''],
    });
  }

  get f() {
    return this.adForm.controls;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onAdSubmit(): void {
    if (this.adForm.invalid) {
      return;
    }

    const ad: Ad = this.adForm.value;

    if (this.editMode) {
      this.adService.updateAd(ad).subscribe({
        next: () => {
          alert('Anuncio actualizado exitosamente');
          this.router.navigate(['/user-profile']);
        },
        error: (err) => {
          console.error('Error al actualizar el anuncio:', err);
          alert('Error al actualizar el anuncio');
        },
      });
    } else {
      this.adService.createAd(ad, this.selectedFiles).subscribe({
        next: (response) => {
          console.log('Anuncio creado:', response);
          alert('Anuncio creado exitosamente');
          this.router.navigate(['/user-profile']);
        },
        error: (err) => {
          console.error('Error al crear anuncio:', err);
          alert('Error al crear anuncio');
        },
      });
    }
  }
}
