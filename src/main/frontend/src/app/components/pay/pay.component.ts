import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '../../material/material/material.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    FormsModule
  ],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent {

  nombre: string = '';
  dir: string = '';

}
