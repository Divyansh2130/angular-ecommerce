import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {
  private wishlistService = inject(WishlistService);

  items = this.wishlistService.items;

  removeItem(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  clearAll(): void {
    this.wishlistService.clearWishlist();
  }
}
