import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { CartService } from '../../../core/services/cart.service';
import { ProductCatalogService } from '../../../core/services/product-catalog.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../shared/models/product.model';
import { ProductDetail } from './product-detail';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;
  let cartCalls: Product[];
  let wishlistCalls: Product[];
  let paramMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  const product: Product = {
    id: 101,
    title: 'Gaming Laptop',
    category: 'Laptop',
    price: 1400,
    originalPrice: 1600,
    rating: 4.7,
    image: '/assets/laptop-main.png',
    gallery: ['/assets/laptop-main.png', '/assets/laptop-side.png'],
    colors: ['#000000', '#ffffff'],
    featureBullets: ['Fast CPU', 'Long battery'],
    specs: [{ label: 'RAM', value: '16GB' }],
    longDescription: 'Extended product description',
    ratingBreakdown: {
      averageRating: 4.7,
      star5Percentage: 70,
      star4Percentage: 20,
      star3Percentage: 5,
      star2Percentage: 3,
      star1Percentage: 2,
    },
    ratingsAndReviews: [
      {
        ratings: 5,
        username: 'A User',
        timestamp: '1 day ago',
        review: 'Excellent laptop',
        likes: 5,
      },
    ],
    categorySlug: 'laptop',
    reviews: 120,
  };

  const fallbackGalleryProduct: Product = {
    id: 202,
    title: 'Laptop Variant',
    price: 1100,
    originalPrice: 1300,
    rating: 4.3,
    image: '/assets/laptop-variant.png',
    gallery: [],
    categorySlug: 'laptop',
  };

  const similarProduct: Product = {
    id: 303,
    title: 'Similar Laptop',
    price: 1200,
    originalPrice: 1400,
    rating: 4.5,
    image: '/assets/similar.png',
  };

  const accessoryProduct: Product = {
    id: 404,
    title: 'Accessory Mouse',
    price: 90,
    originalPrice: 120,
    rating: 4.1,
    image: '/assets/accessory.png',
  };

  beforeEach(async () => {
    cartCalls = [];
    wishlistCalls = [];
    paramMapSubject = new BehaviorSubject(convertToParamMap({ id: String(product.id) }));

    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        provideRouter([]),
        {
          provide: ProductCatalogService,
          useValue: {
            products$: new BehaviorSubject<Product[]>([product, fallbackGalleryProduct]).asObservable(),
            getProductById: (id: number) => {
              if (id === product.id) return product;
              if (id === fallbackGalleryProduct.id) return fallbackGalleryProduct;
              return undefined;
            },
            getProductsByCategorySlug: () => [product, fallbackGalleryProduct],
            getSimilarProducts: () => [similarProduct],
            getAccessoryProducts: () => [accessoryProduct],
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable(),
          },
        },
        {
          provide: CartService,
          useValue: {
            addToCart: (item: Product) => {
              cartCalls.push(item);
            },
          },
        },
        {
          provide: WishlistService,
          useValue: {
            addToWishlist: (item: Product) => {
              wishlistCalls.push(item);
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create and load product from route id', () => {
    expect(component).toBeTruthy();
    expect(component.product?.id).toBe(product.id);
    expect(component.selectedImage).toBe('/assets/laptop-main.png');
  });

  it('should add current product to cart', () => {
    component.addToCart();

    expect(cartCalls.length).toBe(1);
    expect(cartCalls[0]).toEqual(product);
    expect(component.addedToCart()).toBe(true);
  });

  it('should add current product to wishlist', () => {
    component.addToWishlist();

    expect(wishlistCalls.length).toBe(1);
    expect(wishlistCalls[0]).toEqual(product);
    expect(component.addedToWishlist()).toBe(true);
  });

  it('should open lightbox and switch media tab', () => {
    component.openLightbox('/assets/laptop-side.png');
    component.setMediaTab('videos');

    expect(component.isLightboxOpen).toBe(true);
    expect(component.selectedImage).toBe('/assets/laptop-side.png');
    expect(component.activeMediaTab).toBe('videos');
  });

  it('handles close and escape on lightbox', () => {
    component.openLightbox();
    expect(component.isLightboxOpen).toBe(true);

    component.onEsc();
    expect(component.isLightboxOpen).toBe(false);
  });

  it('navigates lightbox images with arrows when open on images tab', () => {
    component.openLightbox('/assets/laptop-main.png');

    component.onArrowRight();
    expect(component.selectedImage).toBe('/assets/laptop-side.png');

    component.onArrowLeft();
    expect(component.selectedImage).toBe('/assets/laptop-main.png');
  });

  it('does not add to cart or wishlist when product is missing', () => {
    component.product = undefined;

    component.addToCart();
    component.addToWishlist();

    expect(cartCalls.length).toBe(0);
    expect(wishlistCalls.length).toBe(0);
  });

  it('uses fallback gallery builder when product has no explicit gallery', () => {
    const gallery = (component as any).buildGalleryImages(fallbackGalleryProduct) as string[];

    expect(gallery.length).toBeGreaterThan(1);
    expect(gallery[0]).toBe(fallbackGalleryProduct.image);
    expect(gallery).toContain(product.image);
  });

  it('scrolls gallery boundaries safely', () => {
    component.galleryImages = [
      '/assets/1.png',
      '/assets/2.png',
      '/assets/3.png',
      '/assets/4.png',
      '/assets/5.png',
      '/assets/6.png',
    ];
    component.galleryStartIndex = 0;

    component.scrollGallery('left');
    expect(component.galleryStartIndex).toBe(0);

    component.scrollGallery('right');
    expect(component.galleryStartIndex).toBe(1);
  });

  it('renders main template sections for a detailed product', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Product information & specifications');
    expect(text).toContain('Customer reviews');
    expect(text).toContain('User ratings and reviews');
    expect(text).toContain('Similar picks for you');
    expect(text).toContain('Add these accessories to your order');
  });

});
