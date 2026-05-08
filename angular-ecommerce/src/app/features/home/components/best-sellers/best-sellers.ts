import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { ProductCatalogService } from '../../../../core/services/product-catalog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-best-sellers',
  imports: [Carousel, ProductCard, CommonModule, SectionHeader],
  templateUrl: './best-sellers.html',
  styleUrl: './best-sellers.css',
})
export class BestSellers implements OnInit, OnDestroy {
  private productCatalog = inject(ProductCatalogService);
  private productsSub?: Subscription;

  products: Product[] = [];

  ngOnInit() {
    this.productsSub = this.productCatalog.products$.subscribe(() => {
      this.products = this.productCatalog.getProductsBySection('best-seller');
    });
  }

  ngOnDestroy() {
    this.productsSub?.unsubscribe();
  }
}
