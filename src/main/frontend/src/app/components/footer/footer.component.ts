import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '../material/material.component';
import { AuthService } from '../../services/auth.service';
import { AdService } from '../../services/ad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MATERIAL_MODULES
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  providers: [AdService, AuthService],
})
export class FooterComponent {

    constructor(
      private adService: AdService,
      private authService: AuthService,
      private router: Router
    ) {}

  vender(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/profile');
    } else {
      // Redirigir al login con queryParams indicando el producto y la ruta de redirección
      this.router.navigate(['/login'], {});
    }
  }

}
