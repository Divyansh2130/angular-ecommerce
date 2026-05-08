import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { ProductCatalogService } from '../../../../core/services/product-catalog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trending-now',
  standalone: true,
  imports: [CommonModule, Carousel, ProductCard, SectionHeader],
  templateUrl: './trending-now.html',
  styleUrl: './trending-now.css',
})
export class TrendingNow implements OnInit, OnDestroy {
  private productCatalog = inject(ProductCatalogService);
  private productsSub?: Subscription;

  products: Product[] = [];

  ngOnInit() {
    this.productsSub = this.productCatalog.products$.subscribe(() => {
      this.products = this.productCatalog.getProductsBySection('trending');
    });
  }

  ngOnDestroy() {
    this.productsSub?.unsubscribe();
  }
}
