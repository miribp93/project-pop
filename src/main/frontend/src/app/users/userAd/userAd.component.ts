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
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-userAd',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule, ReactiveFormsModule],
  templateUrl: './userAd.component.html',
  styleUrls: ['./userAd.component.css'], // Corregido el nombre
})
export class UserAdComponent implements OnInit {
  adForm!: FormGroup;
  selectedFiles: File[] = [];
  editMode = false;
  adId: number | null = null; // Guardamos el ID del anuncio si estamos en edición

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: NotificationService
  ) {}

  ngOnInit(): void {
    this.adForm = this.fb.group({
      adType: ['', Validators.required],
      category: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      city: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: [''],
      condition: [''],
    });

    this.route.queryParams.subscribe((params) => {
      this.editMode = params['editMode'] === 'true';

      // Obtener el ID y convertirlo a número
      const idParam = params['id'];
      if (idParam) {
        this.adId = Number(idParam);  // Convertir de string a number
      }

      // Si estamos en modo edición y tenemos un ID válido, cargar los datos del anuncio
      if (this.editMode && this.adId) {
        this.loadAdData(this.adId); // Pasar el ID como número
      }
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

    if (this.editMode && this.adId) {
      // Modo edición: actualizar anuncio
      this.adService.updateAd(this.adId, ad).subscribe({
        next: () => {
          this.alert.show('Anuncio actualizado exitosamente');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Error al actualizar el anuncio:', err);
          this.alert.show('Error al actualizar el anuncio');
        },
      });
    } else {
      // Modo creación: crear nuevo anuncio
      this.adService.createAd(ad).subscribe({
        next: (response) => {
          console.log('Anuncio creado:', response);
          this.alert.show('Anuncio creado exitosamente');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Error al crear anuncio:', err);
          this.alert.show('Error al crear anuncio');
        },
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/profile']);
  }

  private loadAdData(adId: number): void {
    if (!this.adId) return;

    this.adService.getAdComplete(this.adId).subscribe({
      next: (ad) => {
        this.adForm.patchValue({
          adType: ad?.type_ad,
          category: ad?.category,
          title: ad?.title,
          description: ad?.description,
          city: ad?.city,
          price: ad?.price,
          duration: ad?.duration,
          condition: ad?.condition,
        });
      },
      error: (err) => {
        console.error('Error al cargar datos del anuncio:', err);
        this.alert.show('No se pudieron cargar los datos del anuncio.');
      },
    });
  }
}
