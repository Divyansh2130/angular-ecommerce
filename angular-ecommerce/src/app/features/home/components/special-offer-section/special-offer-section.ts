import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../shared/models/product.model';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { Carousel } from '../../../../shared/components/carousel/carousel';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { FeatureStrip, FeatureStripItem } from '../../../../shared/components/feature-strip/feature-strip';
import { ProductCatalogService } from '../../../../core/services/product-catalog.service';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-special-offer-section',
  standalone: true,
  imports: [ProductCard, CommonModule, Carousel, SectionHeader, FeatureStrip],
  templateUrl: './special-offer-section.html',
  styleUrl: './special-offer-section.css'
})
export class SpecialOfferSectionComponent {
  private productCatalog = inject(ProductCatalogService);
  private contentService = inject(MockContentService);
  private readonly productsState = toSignal(this.productCatalog.products$, {
    initialValue: this.productCatalog.getAllProducts(),
  });
  private readonly content = toSignal(this.contentService.content$, { initialValue: this.contentService.content });

  get products(): Product[] {
    this.productsState();
    return this.productCatalog.getProductsBySection('special-offer');
  }

  get features(): FeatureStripItem[] {
    return this.content().sharedFeatureStrip || [];
  }
}
