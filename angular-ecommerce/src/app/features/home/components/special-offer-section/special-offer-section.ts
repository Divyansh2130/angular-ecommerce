import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { FeatureStrip, FeatureStripItem } from '../../../../shared/components/feature-strip/feature-strip';
import { ProductCatalogService } from '../../../../core/services/product-catalog.service';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-special-offer-section',
  standalone: true,
  imports: [ProductCard, CommonModule, Carousel, SectionHeader, FeatureStrip],
  templateUrl: './special-offer-section.html',
  styleUrl: './special-offer-section.css'
})
export class SpecialOfferSectionComponent implements OnInit, OnDestroy {
  private productCatalog = inject(ProductCatalogService);
  private contentService = inject(MockContentService);

  private productsSub?: Subscription;
  private contentSub?: Subscription;

  products: Product[] = [];
  features: FeatureStripItem[] = [];

  ngOnInit() {
    this.productsSub = this.productCatalog.products$.subscribe(() => {
      this.products = this.productCatalog.getProductsBySection('special-offer');
    });

    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.features = content.sharedFeatureStrip || [];
    });
  }

  ngOnDestroy() {
    this.productsSub?.unsubscribe();
    this.contentSub?.unsubscribe();
  }
}
