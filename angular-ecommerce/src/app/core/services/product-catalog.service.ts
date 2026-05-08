import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductCatalogService {
  private readonly http = inject(HttpClient);
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);

  readonly products$ = this.productsSubject.asObservable();

  constructor() {
    this.http.get<Product[]>('assets/data/products.json').subscribe({
      next: (products) => this.productsSubject.next(products),
      error: () => this.productsSubject.next([]),
    });
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
