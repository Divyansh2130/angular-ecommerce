import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

import { Wishlist } from './wishlist';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../shared/models/product.model';

describe('Wishlist', () => {
  let component: Wishlist;
  let fixture: ComponentFixture<Wishlist>;
  let wishlistService: {
    items: ReturnType<typeof signal<Array<{ product: Product; addedAt?: number }>>>;
    removeFromWishlist: (productId: number) => void;
    clearWishlist: () => void;
  };
  let removeCalledWith: number | undefined;
  let clearCalled = false;
  let wishlistItems = signal<Array<{ product: Product; addedAt?: number }>>([]);

  const sampleProduct: Product = {
    id: 7,
    title: 'Wireless Mouse',
    subtitle: 'Portable accessory',
    description: 'Reliable mouse',
    price: 80,
    originalPrice: 100,
    rating: 4.2,
    image: '/assets/mouse.png',
  };

  beforeEach(async () => {
    wishlistItems = signal([]);
    wishlistService = {
      items: wishlistItems,
      removeFromWishlist: (productId: number) => {
        removeCalledWith = productId;
      },
      clearWishlist: () => {
        clearCalled = true;
      },
    };

    await TestBed.configureTestingModule({
      imports: [Wishlist],
      providers: [provideRouter([]), { provide: WishlistService, useValue: wishlistService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Wishlist);
    component = fixture.componentInstance;
    removeCalledWith = undefined;
    clearCalled = false;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate wishlist actions to WishlistService', () => {
    component.removeItem(7);
    component.clearAll();

    expect(removeCalledWith).toBe(7);
    expect(clearCalled).toBe(true);
  });

  it('renders empty wishlist state', () => {
    wishlistItems.set([]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Your wishlist is empty');
    expect(text).toContain('Continue shopping');
  });

  it('renders wishlist item and summary', () => {
    wishlistItems.set([{ product: sampleProduct, addedAt: Date.now() }]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Wireless Mouse');
    expect(text).toContain('Wishlist summary');
    expect(text).toContain('View details');
    expect(text).toContain('Clear wishlist');
  });
});
