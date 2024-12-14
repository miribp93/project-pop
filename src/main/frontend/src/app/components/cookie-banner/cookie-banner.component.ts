import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  standalone:true,
  imports: [
    CommonModule
  ],
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.css']
})
export class CookieBannerComponent {
  isVisible = !localStorage.getItem('cookiesAccepted');

  acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    this.isVisible = false;
  }
}
