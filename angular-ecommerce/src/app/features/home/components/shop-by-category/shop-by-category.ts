import { Component, inject } from '@angular/core';
import { Category } from '../../../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shop-by-category',
  imports: [CommonModule, RouterLink, SectionHeader],
  templateUrl: './shop-by-category.html',
  styleUrl: './shop-by-category.css',
})
export class ShopByCategory {
  private contentService = inject(MockContentService);
  private readonly content = toSignal(this.contentService.content$, { initialValue: this.contentService.content });

  get categories(): Category[] {
    return this.content().shopByCategories || [];
  }
}
