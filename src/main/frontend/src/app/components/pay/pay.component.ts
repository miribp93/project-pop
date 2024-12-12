import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MATERIAL_MODULES } from '../material/material.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [
    MATERIAL_MODULES,
    FormsModule,
    CommonModule
  ],
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  nombre: string = '';
  dir: string = '';
  productId: string | null = null;
  metodoPago: string = ''; // Nuevo campo para el método de pago

  constructor(private route: ActivatedRoute, private router: Router, private alert: NotificationService) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.queryParamMap.get('productId');
    if (this.productId) {
      this.loadProductDetails(this.productId);
    }
  }

  loadProductDetails(productId: string): void {
    // Implementa la lógica para cargar los detalles del producto
  }

  paySucces(): void {
    this.alert.show("¡Felicidades, su compra ha sido exitosa!");
    this.router.navigate(['/']); // Ejemplo de redirección
  }

  cancelar(): void {
    // Redirigir a la página principal (inicio)
    this.router.navigate(['/']);
  }

}
