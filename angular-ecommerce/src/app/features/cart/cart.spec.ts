import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { computed, signal } from '@angular/core';

import { Cart } from './cart';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../shared/models/product.model';

type CartRow = { product: Product; quantity: number };

describe('Cart', () => {
  let component: Cart;
  let fixture: ComponentFixture<Cart>;
  let cartService: {
    items: ReturnType<typeof signal<CartRow[]>>;
    subtotal: ReturnType<typeof computed<number>>;
    discountTotal: ReturnType<typeof computed<number>>;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
  };
  let increaseCalledWith: number | undefined;
  let decreaseCalledWith: number | undefined;
  let removeCalledWith: number | undefined;
  let clearCalled = false;
  let cartItems = signal<CartRow[]>([]);

  const sampleProduct: Product = {
    id: 1,
    title: 'Gaming Laptop',
    subtitle: 'Fast machine',
    description: 'For power users',
    price: 1500,
    originalPrice: 1800,
    rating: 4.7,
    image: '/assets/gaming.png',
  };

  beforeEach(async () => {
    cartItems = signal([]);
    cartService = {
      items: cartItems,
      subtotal: computed(() =>
        cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      ),
      discountTotal: computed(() =>
        cartItems().reduce(
          (sum, item) =>
            sum + Math.max(item.product.originalPrice - item.product.price, 0) * item.quantity,
          0
        )
      ),
      increaseQuantity: (productId: number) => {
        increaseCalledWith = productId;
      },
      decreaseQuantity: (productId: number) => {
        decreaseCalledWith = productId;
      },
      removeFromCart: (productId: number) => {
        removeCalledWith = productId;
      },
      clearCart: () => {
        clearCalled = true;
      },
    };

    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [provideRouter([]), { provide: CartService, useValue: cartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Cart);
    component = fixture.componentInstance;
    increaseCalledWith = undefined;
    decreaseCalledWith = undefined;
    removeCalledWith = undefined;
    clearCalled = false;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate cart actions to CartService', () => {
    component.increaseQuantity(1);
    component.decreaseQuantity(1);
    component.removeItem(1);
    component.clearAll();

    expect(increaseCalledWith).toBe(1);
    expect(decreaseCalledWith).toBe(1);
    expect(removeCalledWith).toBe(1);
    expect(clearCalled).toBe(true);
  });

  it('renders empty cart state', () => {
    cartItems.set([]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Your cart is empty');
    expect(text).toContain('Continue shopping');
  });

  it('renders cart item and order summary', () => {
    cartItems.set([{ product: sampleProduct, quantity: 2 }]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Gaming Laptop');
    expect(text).toContain('Order summary');
    expect(text).toContain('Clear cart');
    expect(text).toContain('Continue to order');
  });
});
