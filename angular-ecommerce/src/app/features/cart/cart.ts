import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);

  items = this.cartService.items;
  subtotal = this.cartService.subtotal;
  discountTotal = this.cartService.discountTotal;
  shippingCost = computed(() => (this.subtotal() > 0 ? 0 : 0));
  totalAmount = computed(() => this.subtotal() + this.shippingCost());

  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearAll(): void {
    this.cartService.clearCart();
  }
}