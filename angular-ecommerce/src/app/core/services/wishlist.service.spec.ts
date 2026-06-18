import { TestBed } from '@angular/core/testing';
import { WishlistService } from './wishlist.service';
import { Product } from '../../shared/models/product.model';

describe('WishlistService', () => {
  const storageKey = 'nextpick-wishlist';
  const sampleProduct: Product = {
    id: 42,
    title: 'Sample Mouse',
    price: 80,
    originalPrice: 100,
    rating: 4.2,
    image: '/assets/sample-mouse.png',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('adds product once and prevents duplicates', () => {
    const service = TestBed.inject(WishlistService);

    service.addToWishlist(sampleProduct);
    service.addToWishlist(sampleProduct);

    expect(service.itemCount()).toBe(1);
    expect(service.isProductInWishlist(sampleProduct.id)).toBe(true);
  });

  it('removes product from wishlist', () => {
    const service = TestBed.inject(WishlistService);

    service.addToWishlist(sampleProduct);
    service.removeFromWishlist(sampleProduct.id);

    expect(service.itemCount()).toBe(0);
    expect(service.isProductInWishlist(sampleProduct.id)).toBe(false);
  });

  it('hydrates wishlist from localStorage', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify([{ product: sampleProduct, addedAt: 123 }])
    );

    const service = TestBed.inject(WishlistService);

    expect(service.itemCount()).toBe(1);
    expect(service.items()[0].product.id).toBe(sampleProduct.id);
  });
});
