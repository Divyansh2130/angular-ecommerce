import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Category } from '../../../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-by-category',
  imports: [CommonModule, RouterLink, SectionHeader],
  templateUrl: './shop-by-category.html',
  styleUrl: './shop-by-category.css',
})
export class ShopByCategory implements OnInit, OnDestroy {
  private contentService = inject(MockContentService);
  private contentSub?: Subscription;

  categories: Category[] = [];

  ngOnInit() {
    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.categories = content.shopByCategories || [];
    });
  }

  ngOnDestroy() {
    this.contentSub?.unsubscribe();
  }
}
