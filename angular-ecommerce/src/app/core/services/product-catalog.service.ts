import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../shared/models/product.model';

interface BackendProductResponse {
  success: boolean;
  products: BackendProduct[];
}

interface BackendProduct {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  images?: Array<{ url?: string }>;
  price: number;
  discountPrice?: number;
  rating?: number;
  totalReviews?: number;
  inStock?: boolean;
  isTrending?: boolean;
  isBestDeal?: boolean;
  category?: { name?: string } | string;
  type?: { name?: string } | string;
  brand?: { name?: string } | string;
  productInformation?: string[];
  specifications?: Record<string, string>;
  ratingBreakdown?: Product['ratingBreakdown'];
  ratingsAndReviews?: Product['ratingsAndReviews'];
}

@Injectable({
  providedIn: 'root',
})
export class ProductCatalogService {
  private readonly http = inject(HttpClient);
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  private readonly apiUrl = 'http://localhost:5000/api/products';

  readonly products$ = this.productsSubject.asObservable();

  constructor() {
    this.http.get<BackendProductResponse>(`${this.apiUrl}?limit=500`).subscribe({
      next: (response) => {
        const products = (response.products || []).map((item) => this.mapBackendProduct(item));
        this.productsSubject.next(products);
      },
      error: () => {
        this.http.get<Product[]>('assets/data/products.json').subscribe({
          next: (products) => this.productsSubject.next(products),
          error: () => this.productsSubject.next([]),
        });
      },
    });
  }

  private mapBackendProduct(item: BackendProduct): Product {
    const currentPrice = item.discountPrice ?? item.price;
    const originalPrice = item.price;
    const hasDiscount = item.discountPrice !== undefined && item.discountPrice < item.price;
    const brandName =
      typeof item.brand === 'string' ? item.brand : (item.brand?.name ?? '');
    const categoryName = typeof item.category === 'string' ? item.category : (item.category?.name ?? '');
    const categorySlug = this.slugify(categoryName);
    const sectionTags = [
      ...(item.isBestDeal ? ['best-seller', 'laptop-deals'] : []),
      ...(item.isTrending ? ['trending'] : []),
      'listing',
    ];

    const specs = item.specifications
      ? Object.entries(item.specifications).map(([label, value]) => ({ label, value }))
      : undefined;

    return {
      id: this.getStableId(item._id || item.slug || item.name),
      slug: item.slug || this.slugify(item.name),
      title: item.name,
      subtitle: item.description,
      description: item.description,
      image: item.thumbnail || item.images?.[0]?.url || '/assets/images/category_page/type-section/all.png',
      gallery: (item.images || []).map((image) => image.url || '').filter(Boolean),
      price: currentPrice,
      originalPrice,
      rating: item.rating ?? 0,
      reviews: item.totalReviews ?? 0,
      brand: brandName,
      category: categoryName,
      categorySlug,
      inStock: item.inStock ?? true,
      featureBullets: item.productInformation,
      specs,
      ratingBreakdown: item.ratingBreakdown,
      ratingsAndReviews: item.ratingsAndReviews,
      discount: hasDiscount
        ? `${Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%`
        : undefined,
      sectionTags: [...new Set(sectionTags)],
    };
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private getStableId(value: string): number {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) | 0;
    }

    return Math.abs(hash) + 10000;
  }

  getAllProducts(): Product[] {
    return this.productsSubject.value;
  }

  getProductById(id: number): Product | undefined {
    return this.productsSubject.value.find((product) => product.id === id);
  }

  getProductsByCategorySlug(categorySlug: string): Product[] {
    return this.productsSubject.value.filter((product) => product.categorySlug === categorySlug);
  }

  getProductsBySection(sectionTag: string): Product[] {
    return this.productsSubject.value.filter((product) => product.sectionTags?.includes(sectionTag));
  }

  getProductsByIds(ids: number[]): Product[] {
    return ids
      .map((id) => this.getProductById(id))
      .filter((product): product is Product => Boolean(product));
  }

  getSimilarProducts(product: Product, limit = 4): Product[] {
    return this.productsSubject.value
      .filter((item) => item.id !== product.id && item.categorySlug === product.categorySlug)
      .slice(0, limit);
  }

  getAccessoryProducts(limit = 4): Product[] {
    return this.getProductsByCategorySlug('accessories').slice(0, limit);
  }
}
