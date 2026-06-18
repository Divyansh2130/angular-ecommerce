import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../../shared/models/product.model';

describe('CartService', () => {
  const storageKey = 'nextpick-cart';
  const sampleProduct: Product = {
    id: 100,
    title: 'Sample Laptop',
    price: 1200,
    originalPrice: 1400,
    rating: 4.5,
    image: '/assets/sample.png',
  };
  const noDiscountProduct: Product = {
    id: 101,
    title: 'Accessory',
    price: 100,
    originalPrice: 80,
    rating: 4.2,
    image: '/assets/accessory.png',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('adds a new product and increases quantity for repeated add', () => {
    const service = TestBed.inject(CartService);

    service.addToCart(sampleProduct);
    service.addToCart(sampleProduct);

    expect(service.uniqueItemCount()).toBe(1);
    expect(service.itemCount()).toBe(2);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.subtotal()).toBe(2400);
  });

  it('decreases quantity and removes item when quantity reaches zero', () => {
    const service = TestBed.inject(CartService);

    service.addToCart(sampleProduct);
    service.decreaseQuantity(sampleProduct.id);

    expect(service.items().length).toBe(0);
    expect(service.itemCount()).toBe(0);
  });

  it('hydrates cart items from localStorage', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify([{ product: sampleProduct, quantity: 3 }])
    );

    const service = TestBed.inject(CartService);

    expect(service.uniqueItemCount()).toBe(1);
    expect(service.itemCount()).toBe(3);
    expect(service.items()[0].product.id).toBe(sampleProduct.id);
  });

  it('persists updated cart data to localStorage', () => {
    const service = TestBed.inject(CartService);

    service.addToCart(sampleProduct);

    const persisted = JSON.parse(localStorage.getItem(storageKey) || '[]') as Array<{ quantity: number }>;
    expect(persisted.length).toBe(1);
    expect(persisted[0].quantity).toBe(1);
  });

  it('removes specific item and clears full cart', () => {
    const service = TestBed.inject(CartService);

    service.addToCart(sampleProduct);
    service.addToCart(noDiscountProduct);
    expect(service.uniqueItemCount()).toBe(2);

    service.removeFromCart(sampleProduct.id);
    expect(service.uniqueItemCount()).toBe(1);
    expect(service.items()[0].product.id).toBe(noDiscountProduct.id);

    service.clearCart();
    expect(service.items()).toEqual([]);
    expect(service.itemCount()).toBe(0);
  });

  it('computes discount total with non-negative clamp', () => {
    const service = TestBed.inject(CartService);

    service.addToCart(sampleProduct);
    service.addToCart(noDiscountProduct);

    expect(service.discountTotal()).toBe(200);
  });

  it('handles malformed cart json in localStorage', () => {
    localStorage.setItem(storageKey, '{not-valid-json');

    const service = TestBed.inject(CartService);

    expect(service.items()).toEqual([]);
    expect(service.itemCount()).toBe(0);
  });
});
