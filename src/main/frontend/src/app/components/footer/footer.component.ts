import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '../material/material.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MATERIAL_MODULES
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
