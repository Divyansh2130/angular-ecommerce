import { Component, Input, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { ProductCatalogService } from '../../../../core/services/product-catalog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-our-best-laptop-deals',
  standalone: true,
  imports: [CommonModule, Carousel, ProductCard, SectionHeader],
  templateUrl: './our-best-laptop-deals.html',
  styleUrl: './our-best-laptop-deals.css',
})
export class OurBestLaptopDeals implements OnInit, OnDestroy {
  @Input() category = 'Laptop';

  private productCatalog = inject(ProductCatalogService);
  private productsSub?: Subscription;

  products: Product[] = [];

  ngOnInit() {
    this.productsSub = this.productCatalog.products$.subscribe(() => {
      this.products = this.productCatalog.getProductsBySection('laptop-deals');
    });
  }

  ngOnDestroy() {
    this.productsSub?.unsubscribe();
  }

  get sectionTitle(): string {
    return `Our Best ${this.category} Deals`;
  }
}
