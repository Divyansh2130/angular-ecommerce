import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Type } from '../../shared/models/type.model';
import { CommonModule } from '@angular/common';
import { TypeSection } from './components/type-section/type-section';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LaptopBrands } from './components/laptop-brands/laptop-brands';
import { FeatureStrip, FeatureStripItem } from '../../shared/components/feature-strip/feature-strip';
import { OurBestLaptopDeals } from './components/our-best-laptop-deals/our-best-laptop-deals';
import { TrendingNow } from './components/trending-now/trending-now';
import { FaqSection } from './components/faq-section/faq-section';
import { CategoryBlog } from './components/category-blog/category-blog';
import { MockContentService } from '../../core/services/mock-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  imports: [CommonModule, RouterLink, TypeSection, LaptopBrands, FeatureStrip, OurBestLaptopDeals, TrendingNow, FaqSection, CategoryBlog],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private contentService = inject(MockContentService);

  types: Type[] = [];
  category = '';
  categorySlug = 'laptop';
  features: FeatureStripItem[] = [];

  private typesMap: Record<string, Type[]> = {};
  private contentSub?: Subscription;
  private routeSub?: Subscription;

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const category = params.get('name');
      this.category = category || '';
      this.categorySlug = this.normalizeCategorySlug(category || 'laptop');
      this.loadTypesForCategory(this.categorySlug);
    });

    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.features = content.sharedFeatureStrip || [];
      this.typesMap = content.categoryTypesMap || {};
      this.loadTypesForCategory(this.categorySlug);
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.contentSub?.unsubscribe();
  }

  private loadTypesForCategory(slug: string) {
    this.types = this.typesMap[slug] || [];
  }

  private normalizeCategorySlug(value: string): string {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === 'laptops') {
      return 'laptop';
    }
    return trimmed;
  }
}
