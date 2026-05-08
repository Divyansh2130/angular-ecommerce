import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey = 'nextpick-cart';
  private readonly itemsState = signal<CartItem[]>(this.readInitialItems());

  readonly items = this.itemsState.asReadonly();
  readonly uniqueItemCount = computed(() => this.itemsState().length);
  readonly itemCount = computed(() =>
    this.itemsState().reduce((total, item) => total + item.quantity, 0)
  );
  readonly subtotal = computed(() =>
    this.itemsState().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );
  readonly discountTotal = computed(() =>
    this.itemsState().reduce((total, item) => {
      const discountPerItem = Math.max(item.product.originalPrice - item.product.price, 0);
      return total + discountPerItem * item.quantity;
    }, 0)
  );

  addToCart(product: Product): void {
    const currentItems = this.itemsState();
    const existingItem = currentItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      this.itemsState.set(
        currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.itemsState.set([...currentItems, { product, quantity: 1 }]);
    }

    this.persistItems();
  }

  increaseQuantity(productId: number): void {
    this.itemsState.set(
      this.itemsState().map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    this.persistItems();
  }

  decreaseQuantity(productId: number): void {
    const nextItems = this.itemsState()
      .map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    this.itemsState.set(nextItems);
    this.persistItems();
  }

  removeFromCart(productId: number): void {
    this.itemsState.set(this.itemsState().filter((item) => item.product.id !== productId));
    this.persistItems();
  }

  clearCart(): void {
    this.itemsState.set([]);
    this.persistItems();
  }

  private readInitialItems(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const storedItems = localStorage.getItem(this.storageKey);
      return storedItems ? (JSON.parse(storedItems) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private persistItems(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(this.itemsState()));
  }
}