import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ContactForm } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MATERIAL_MODULES,ReactiveFormsModule,CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alert: NotificationService
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: [''], // Opcional
      email: ['', [Validators.required, Validators.email]],
      telefono: [''], // Opcional
      direccion: [''], // Opcional
      comentario: ['', Validators.required],
    });
  }

  cancelar() {
    this.router.navigate(['/']);
  }

  enviar() {
    if (this.contactForm.valid) {
      const formData: ContactForm = this.contactForm.value;
      this.authService.contactForm(formData).subscribe({
        next: (response: string) => {
          this.alert.show('Correo enviado con éxito');
          this.contactForm.reset();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al enviar el correo:', err);
          this.alert.show('Hubo un error al enviar el correo');
        },
      });
    } else {
      this.alert.show('Por favor, complete todos los campos obligatorios');
    }
  }
}
