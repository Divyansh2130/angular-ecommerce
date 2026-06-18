import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ProductCatalogService } from '../../../core/services/product-catalog.service';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-search-panel',
  imports: [CommonModule, RouterLink],
  templateUrl: './search-panel.html',
  styleUrl: './search-panel.css',
})
export class SearchPanel {
  private readonly categoryService = inject(CategoryService);
  private readonly productCatalog = inject(ProductCatalogService);

  @Input() query = '';
  @Output() resultSelected = new EventEmitter<void>();

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  get categoryMatches(): Category[] {
    const term = this.normalize(this.query);
    if (!term) {
      return [];
    }

    return this.categoryService
      .getCategories()
      .filter((category) => category.name.toLowerCase().includes(term))
      .slice(0, 4);
  }

  get productMatches(): Product[] {
    const term = this.normalize(this.query);
    if (!term) {
      return [];
    }

    return this.productCatalog
      .getAllProducts()
      .filter((product) => {
        const title = product.title.toLowerCase();
        const subtitle = product.subtitle?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';
        return title.includes(term) || subtitle.includes(term) || description.includes(term);
      })
      .slice(0, 6);
  }

  get hasQuery(): boolean {
    return this.normalize(this.query).length > 0;
  }

  get hasResults(): boolean {
    return this.categoryMatches.length > 0 || this.productMatches.length > 0;
  }

  onResultClick(): void {
    this.resultSelected.emit();
  }

}
