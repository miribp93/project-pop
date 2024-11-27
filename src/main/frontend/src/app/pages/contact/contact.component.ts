import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
onAdSubmit() {
throw new Error('Method not implemented.');
}
  contactForm: FormGroup;


  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,private alert: NotificationService) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: [''],
      comentario: ['', Validators.required],
    });
  }

  cancelar() {
    this.router.navigate(['/']);
  }

  enviar() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.authService.sendContactEmail(formData).subscribe({
        next: () => {
          this.alert.show('Correo enviado con éxito');
          this.contactForm.reset();
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
