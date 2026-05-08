import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';

export interface WishlistItem {
  product: Product;
  addedAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly storageKey = 'nextpick-wishlist';
  private readonly itemsState = signal<WishlistItem[]>(this.readInitialItems());

  readonly items = this.itemsState.asReadonly();
  readonly itemCount = computed(() => this.itemsState().length);

  addToWishlist(product: Product): void {
    const currentItems = this.itemsState();
    const existingItem = currentItems.find((item) => item.product.id === product.id);

    if (!existingItem) {
      this.itemsState.set([...currentItems, { product, addedAt: Date.now() }]);
      this.persistItems();
    }
  }

  removeFromWishlist(productId: number): void {
    this.itemsState.set(this.itemsState().filter((item) => item.product.id !== productId));
    this.persistItems();
  }

  clearWishlist(): void {
    this.itemsState.set([]);
    this.persistItems();
  }

  isProductInWishlist(productId: number): boolean {
    return this.itemsState().some((item) => item.product.id === productId);
  }

  private readInitialItems(): WishlistItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const storedItems = localStorage.getItem(this.storageKey);
      return storedItems ? (JSON.parse(storedItems) as WishlistItem[]) : [];
    } catch {
      return [];
    }
  }

  private persistItems(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.itemsState()));
    } catch {
      console.warn('Failed to persist wishlist items to localStorage');
    }
  }
}
