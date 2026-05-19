import { Component, inject } from '@angular/core';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { ProductCatalogService } from '../../../../core/services/product-catalog.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-best-sellers',
  imports: [Carousel, ProductCard, CommonModule, SectionHeader],
  templateUrl: './best-sellers.html',
  styleUrl: './best-sellers.css',
})
export class BestSellers {
  private productCatalog = inject(ProductCatalogService);
  private readonly productsState = toSignal(this.productCatalog.products$, {
    initialValue: this.productCatalog.getAllProducts(),
  });

  get products(): Product[] {
    this.productsState();
    return this.productCatalog.getProductsBySection('best-seller');
  }
}
