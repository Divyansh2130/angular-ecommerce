import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductCatalogService } from './product-catalog.service';

describe('ProductCatalogService', () => {
  let service: ProductCatalogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductCatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps backend products and exposes query helpers', () => {
    const backendRequest = httpMock.expectOne('http://localhost:5000/api/products?limit=500');
    backendRequest.flush({
      success: true,
      products: [
        {
          _id: 'p-1',
          name: 'Gaming Laptop',
          slug: 'gaming-laptop',
          description: 'Powerful gaming device',
          thumbnail: '/assets/gaming-main.png',
          images: [{ url: '/assets/gaming-main.png' }, { url: '/assets/gaming-side.png' }],
          price: 2000,
          discountPrice: 1500,
          rating: 4.8,
          totalReviews: 120,
          inStock: true,
          isTrending: true,
          isBestDeal: true,
          category: { name: 'Laptop' },
          brand: { name: 'Acer' },
          productInformation: ['RGB keyboard'],
          specifications: { RAM: '16GB' },
        },
        {
          _id: 'p-2',
          name: 'Wireless Mouse',
          description: 'Accessory',
          price: 120,
          rating: 4.2,
          totalReviews: 30,
          inStock: true,
          category: 'Accessories',
          brand: 'Logitech',
        },
      ],
    });

    const products = service.getAllProducts();
    expect(products.length).toBe(2);

    const gaming = products.find((product) => product.slug === 'gaming-laptop');
    expect(gaming).toBeTruthy();
    expect(gaming?.price).toBe(1500);
    expect(gaming?.originalPrice).toBe(2000);
    expect(gaming?.discount).toBe('25%');
    expect(gaming?.categorySlug).toBe('laptop');
    expect(gaming?.sectionTags?.includes('trending')).toBe(true);
    expect(gaming?.sectionTags?.includes('best-seller')).toBe(true);
    expect(gaming?.specs?.[0].label).toBe('RAM');

    const byId = service.getProductById(gaming!.id);
    expect(byId?.title).toBe('Gaming Laptop');

    expect(service.getProductsByCategorySlug('laptop').length).toBe(1);
    expect(service.getProductsBySection('trending').length).toBe(1);
    expect(service.getProductsByIds([gaming!.id, 999999]).length).toBe(1);
    expect(service.getSimilarProducts(gaming!, 2).length).toBe(0);
    expect(service.getAccessoryProducts(2).length).toBe(1);
  });

  it('falls back to local json when backend request fails', () => {
    const backendRequest = httpMock.expectOne('http://localhost:5000/api/products?limit=500');
    backendRequest.flush({ message: 'failed' }, { status: 500, statusText: 'Server Error' });

    const assetRequest = httpMock.expectOne('assets/data/products.json');
    assetRequest.flush([
      {
        id: 1,
        title: 'Fallback Product',
        price: 500,
        originalPrice: 700,
        rating: 4,
        image: '/assets/fallback.png',
        categorySlug: 'laptop',
      },
    ]);

    expect(service.getAllProducts().length).toBe(1);
    expect(service.getAllProducts()[0].title).toBe('Fallback Product');
  });

  it('sets empty list when backend and local fallback both fail', () => {
    const backendRequest = httpMock.expectOne('http://localhost:5000/api/products?limit=500');
    backendRequest.flush({ message: 'failed' }, { status: 500, statusText: 'Server Error' });

    const assetRequest = httpMock.expectOne('assets/data/products.json');
    assetRequest.flush({ message: 'missing' }, { status: 404, statusText: 'Not Found' });

    expect(service.getAllProducts()).toEqual([]);
  });
});
