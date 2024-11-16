import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '../../components/material/material.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MATERIAL_MODULES
  ],
  templateUrl: './resetPassword.component.html',
  styleUrl: './resetPassword.component.css'
})
export class ResetPasswordComponent {
newPass: any;
newPass2: any;
resetPass() {
throw new Error('Method not implemented.');
}

}
