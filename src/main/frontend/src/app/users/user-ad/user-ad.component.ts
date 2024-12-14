import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  templateUrl: './user-ad.component.html',
  styleUrls: ['./user-ad.component.css'],
})
export class UserAdComponent implements OnInit {
  adForm!: FormGroup;
  selectedFiles: File[] = [];
  editMode = false;
  idAd: number | null = null;

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: NotificationService
  ) {}

  ngOnInit(): void {
    this.adForm = this.fb.group({
      typeAd: ['', Validators.required],
      category: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      city: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),],],

      duration: [''],
      condition: [''],
    });

    this.route.queryParams.subscribe((params) => {
      this.editMode = params['editMode'] === 'true';
      this.idAd = params['id'] ? Number(params['id']) : null;

      if (this.editMode && this.idAd) {
        this.loadAdData(this.idAd);
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

    const adData: Ad = {
      ...this.adForm.value,
    };

    if (this.editMode && this.idAd) {
      this.updateAd(this.idAd, adData, this.selectedFiles);
    } else {
      this.adService.createAd(adData, this.selectedFiles).subscribe({
        next: (response) => {
          this.alert.show('Anuncio creado exitosamente');
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.alert.show('Error al crear anuncio');
        },
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/profile']);
  }

  private loadAdData(idAd: number): void {
    this.adService.getAdComplete(idAd).subscribe({
      next: (ad) => {
        if (ad) {
          this.adForm.patchValue(ad); // Rellena el formulario solo si ad no es undefined
        } else {
          this.alert.show('No se pudo cargar el anuncio, inténtelo de nuevo.');
        }
      },
      error: (err) => {
        console.error('Error al cargar datos del anuncio:', err);
        this.alert.show('No se pudieron cargar los datos del anuncio.');
      },
    });
  }



  private updateAd(idAd: number, adData: Ad, files: File[]): void {
    this.adService.updateAd(idAd, adData, files).subscribe({
      next: () => {
        this.alert.show('Anuncio actualizado exitosamente');
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.alert.show('Error al actualizar el anuncio');
      },
    });
  }

}
