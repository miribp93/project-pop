import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from '../../material/material/material.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    MATERIAL_MODULES,

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


}
