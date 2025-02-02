import { Component, OnInit, ViewChild } from '@angular/core';
import { MATERIAL_MODULES } from '../material/material.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-info-function',
  standalone: true,
  imports: [MATERIAL_MODULES],
  templateUrl: './info-function.component.html',
  styleUrl: './info-function.component.css'
})
export class InfoFunctionComponent {

  constructor(
      private router: Router
    ) {}

  register(): void {
          this.router.navigateByUrl('/register');
    }
}
