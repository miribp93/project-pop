import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  nombre: string = '';
  dir: string = '';
  productId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

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
    alert("¡Felicidades, su compra ha sido exitosa!");
    this.router.navigate(['/']); // Ejemplo de redirección
  }

  cancelar(): void {
    // Redirigir a la página principal (inicio)
    this.router.navigate(['/']);
  }

}
