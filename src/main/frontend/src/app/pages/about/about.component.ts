import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '../../components/material/material.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    MATERIAL_MODULES
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
