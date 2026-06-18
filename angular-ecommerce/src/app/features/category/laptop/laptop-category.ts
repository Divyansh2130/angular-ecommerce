import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../shared/models/product.model';
import { ProductCatalogService } from '../../../core/services/product-catalog.service';

@Component({
  selector: 'app-laptop-category',
  imports: [CommonModule],
  templateUrl: './laptop-category.html',
  styleUrl: './laptop-category.css',
})
export class LaptopCategory implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productCatalog = inject(ProductCatalogService);

  categorySlug = 'laptop';
  categoryLabel = 'Laptop';

  selectedBrands = new Set<string>();
  selectedRam = new Set<string>();
  selectedOs = new Set<string>();
  selectedType = '';
  private typeFilterMode: 'all' | 'windows' | 'macbook' | 'gaming' | 'chromebook' | 'deals' | 'keyword' = 'all';

  maxPrice = 2000;
  onlyAvailable = false;
  fastShippingOnly = false;
  sortBy: 'recommended' | 'priceAsc' | 'priceDesc' | 'rating' = 'recommended';
  pageSize = 9;
  currentPage = 1;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') || 'laptop';
      this.categorySlug = slug;
      this.categoryLabel = slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      this.resetFilters();
      this.applyQueryFilters();
    });

    this.route.queryParamMap.subscribe(() => {
      this.applyQueryFilters();
    });
  }

  private resetFilters() {
    this.selectedBrands.clear();
    this.selectedRam.clear();
    this.selectedOs.clear();
    this.selectedType = '';
    this.onlyAvailable = false;
    this.fastShippingOnly = false;
    this.sortBy = 'recommended';
    this.currentPage = 1;
    this.maxPrice = Math.max(...this.categoryProducts.map((p) => p.price), 2000);
  }

  private applyQueryFilters() {
    const brand = this.route.snapshot.queryParamMap.get('brand');
    const type = this.route.snapshot.queryParamMap.get('type');

    this.selectedBrands.clear();

    if (brand) {
      const matchedBrand = this.brandOptions.find((b) => b.toLowerCase() === brand.toLowerCase());
      if (matchedBrand) {
        this.selectedBrands.add(matchedBrand);
      }
    }

    this.applyTypeQuery(type);
    this.currentPage = 1;
  }

  private applyTypeQuery(type: string | null) {
    const normalized = (type || '').trim().toLowerCase();
    this.selectedType = normalized;

    if (!normalized || normalized.includes('all laptop')) {
      this.typeFilterMode = 'all';
      return;
    }

    if (normalized.includes('windows')) {
      this.typeFilterMode = 'windows';
      return;
    }

    if (normalized.includes('macbook') || normalized.includes('mac')) {
      this.typeFilterMode = 'macbook';
      return;
    }

    if (normalized.includes('gaming')) {
      this.typeFilterMode = 'gaming';
      return;
    }

    if (normalized.includes('chromebook')) {
      this.typeFilterMode = 'chromebook';
      return;
    }

    if (normalized.includes('deal')) {
      this.typeFilterMode = 'deals';
      return;
    }

    this.typeFilterMode = 'keyword';
  }

  private matchesTypeFilter(product: Product): boolean {
    const title = product.title.toLowerCase();
    const subtitle = product.subtitle?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || '';
    const os = product.os?.toLowerCase() || '';
    const sectionTags = product.sectionTags || [];

    switch (this.typeFilterMode) {
      case 'all':
        return true;
      case 'windows':
        return os.includes('windows');
      case 'macbook':
        return brand === 'apple' || os.includes('mac');
      case 'gaming':
        return title.includes('gaming') || subtitle.includes('gaming') || description.includes('gaming');
      case 'chromebook':
        return title.includes('chromebook') || subtitle.includes('chromebook') || description.includes('chromebook');
      case 'deals':
        return sectionTags.includes('laptop-deals') || !!product.discount;
      case 'keyword':
      default:
        return title.includes(this.selectedType) || subtitle.includes(this.selectedType) || description.includes(this.selectedType);
    }
  }

  get categoryProducts(): Product[] {
    return this.productCatalog.getProductsByCategorySlug(this.categorySlug);
  }

  get brandOptions(): string[] {
    return [...new Set(this.categoryProducts.map((p) => p.brand).filter(Boolean) as string[])].sort();
  }

  get ramOptions(): string[] {
    return [...new Set(this.categoryProducts.map((p) => p.ram).filter(Boolean) as string[])].sort();
  }

  get osOptions(): string[] {
    return [...new Set(this.categoryProducts.map((p) => p.os).filter(Boolean) as string[])].sort();
  }

  toggleInSet(set: Set<string>, value: string, checked: boolean) {
    if (checked) {
      set.add(value);
    } else {
      set.delete(value);
    }
    this.currentPage = 1;
  }

  onMaxPriceChange(value: number) {
    this.maxPrice = value;
    this.currentPage = 1;
  }

  onFastShippingChange(checked: boolean) {
    this.fastShippingOnly = checked;
    this.currentPage = 1;
  }

  onOnlyAvailableChange(checked: boolean) {
    this.onlyAvailable = checked;
    this.currentPage = 1;
  }

  onSortChange(value: string) {
    this.sortBy = value as 'recommended' | 'priceAsc' | 'priceDesc' | 'rating';
    this.currentPage = 1;
  }

  openProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  openHome() {
    this.router.navigate(['/']);
  }

  openCategoryPage() {
    this.router.navigate(['/category', this.categorySlug]);
  }

  get filteredProducts(): Product[] {
    let result = this.categoryProducts.filter((p) => {
      const brandOk = this.selectedBrands.size === 0 || (p.brand ? this.selectedBrands.has(p.brand) : false);
      const ramOk = this.selectedRam.size === 0 || (p.ram ? this.selectedRam.has(p.ram) : false);
      const osOk = this.selectedOs.size === 0 || (p.os ? this.selectedOs.has(p.os) : false);
      const typeOk = this.matchesTypeFilter(p);
      const priceOk = p.price <= this.maxPrice;
      const availableOk = !this.onlyAvailable || p.inStock;
      const shippingOk = !this.fastShippingOnly || p.fastShipping;
      return brandOk && ramOk && osOk && typeOk && priceOk && availableOk && shippingOk;
    });

    switch (this.sortBy) {
      case 'priceAsc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        result = [...result].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
    }

    return result;
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.filteredProducts.length / this.pageSize), 1);
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get visibleStart(): number {
    if (this.filteredProducts.length === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get visibleEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredProducts.length);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
  }
}
