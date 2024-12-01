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
import { Router, ActivatedRoute } from '@angular/router';
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
  adId: number | null = null; // Agregar propiedad para manejar ID del anuncio

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  // Inicializa el formulario
  private initializeForm(): void {
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
  }

  // Verifica si es modo edición y carga los datos si corresponde
  private checkEditMode(): void {
    this.route.queryParams.subscribe((params) => {
      this.editMode = params['editMode'] === 'true';
      const idParam = params['id'];
      if (idParam) {
        this.adId = Number(idParam);
        if (this.editMode) {
          this.loadAdData(this.adId);
        }
      }
    });
  }

  // Carga datos del anuncio en el formulario
  private loadAdData(adId: number): void {
    this.adService.getAdComplete(adId).subscribe({
      next: (ad) => {
        this.adForm.patchValue({
          adType: ad?.typeAd,
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

  get f() {
    return this.adForm.controls;
  }

  // Manejo de selección de archivos
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  // Maneja la creación o actualización del anuncio
  onAdSubmit(): void {
    if (this.adForm.invalid) {
      return;
    }

    const adData: Ad = {
      ...this.adForm.value,
      typeAd: this.adForm.value.adType,
    };

    if (this.editMode && this.adId) {
      this.updateAd(this.adId, adData, this.selectedFiles);
    } else {
      this.createAd(adData, this.selectedFiles);
    }
  }

  // Método para crear anuncio
  private createAd(adData: Ad, files: File[]): void {
    this.adService.createAd(adData, files).subscribe({
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

  // Método para actualizar anuncio
  private updateAd(adId: number, adData: Ad, files: File[]): void {
    const formData = new FormData();
    formData.append('createAdDTO', JSON.stringify(adData));
    files.forEach((file) => formData.append('photos', file));

    this.adService.updateAd(adId, formData).subscribe({
      next: (response) => {
        console.log('Anuncio actualizado:', response);
        this.alert.show('Anuncio actualizado exitosamente');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Error al actualizar el anuncio:', err);
        this.alert.show('Error al actualizar el anuncio');
      },
    });
  }

  // Cancelar y regresar al perfil
  cancelar(): void {
    this.router.navigate(['/profile']);
  }
}
