import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AdminInventoryService,
  InventoryOption,
  InventoryPayload,
  InventoryProduct,
} from '../../../core/services/admin-inventory.service';

@Component({
  selector: 'app-inventory-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-admin.html',
  styleUrl: './inventory-admin.css',
})
export class InventoryAdmin implements OnInit {
  private fb = inject(FormBuilder);
  private inventoryService = inject(AdminInventoryService);

  products = signal<InventoryProduct[]>([]);
  categories = signal<InventoryOption[]>([]);
  types = signal<InventoryOption[]>([]);
  brands = signal<InventoryOption[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  editingId = signal<string | null>(null);

  readonly filteredTypes = computed(() => {
    const categoryId = this.form.controls.categoryId.value;
    if (!categoryId) {
      return [];
    }

    const categoryName = this.categories().find((category) => category._id === categoryId)?.name;
    if (!categoryName) {
      return [];
    }

    return this.types().filter(
      (type) => (type.category || '').toLowerCase() === categoryName.toLowerCase().replace(/\s+/g, '-')
    );
  });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required]],
    description: [''],
    categoryId: ['', [Validators.required]],
    typeId: [''],
    brandId: [''],
    price: [0, [Validators.required, Validators.min(1)]],
    discountPrice: [0],
    thumbnail: [''],
    inStock: [true],
    isBestDeal: [false],
    isTrending: [false],
  });

  ngOnInit() {
    this.loadOptions();
    this.loadInventory();

    this.form.controls.name.valueChanges.subscribe((name) => {
      if (!this.editingId() && name) {
        this.form.controls.slug.setValue(this.slugify(name), { emitEvent: false });
      }
    });
  }

  loadOptions() {
    this.inventoryService.getOptions().subscribe({
      next: (response) => {
        this.categories.set(response.categories || []);
        this.types.set(response.types || []);
        this.brands.set(response.brands || []);
      },
      error: () => {
        this.errorMessage.set('Unable to load inventory options.');
      },
    });
  }

  loadInventory() {
    this.isLoading.set(true);
    this.inventoryService.getInventory().subscribe({
      next: (response) => {
        this.products.set(response.products || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load inventory products.');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isSubmitting.set(true);

    const payload = this.buildPayload();
    const request = this.editingId()
      ? this.inventoryService.updateProduct(this.editingId() as string, payload)
      : this.inventoryService.createProduct(payload);

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set(this.editingId() ? 'Product updated successfully.' : 'Product created successfully.');
        this.cancelEdit();
        this.loadInventory();
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.error?.message || 'Unable to save product.');
      },
    });
  }

  editProduct(product: InventoryProduct) {
    this.editingId.set(product._id);
    this.form.patchValue({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      categoryId: product.category?._id || '',
      typeId: product.type?._id || '',
      brandId: product.brand?._id || '',
      price: product.price,
      discountPrice: product.discountPrice || 0,
      thumbnail: product.thumbnail || '',
      inStock: product.inStock,
      isBestDeal: product.isBestDeal,
      isTrending: product.isTrending,
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.form.reset({
      name: '',
      slug: '',
      description: '',
      categoryId: '',
      typeId: '',
      brandId: '',
      price: 0,
      discountPrice: 0,
      thumbnail: '',
      inStock: true,
      isBestDeal: false,
      isTrending: false,
    });
  }

  deleteProduct(product: InventoryProduct) {
    const shouldDelete = confirm(`Delete ${product.name}?`);
    if (!shouldDelete) {
      return;
    }

    this.inventoryService.deleteProduct(product._id).subscribe({
      next: () => {
        this.successMessage.set('Product deleted successfully.');
        this.loadInventory();
      },
      error: () => {
        this.errorMessage.set('Unable to delete product.');
      },
    });
  }

  private buildPayload(): InventoryPayload {
    const raw = this.form.getRawValue();

    return {
      name: raw.name?.trim() || '',
      slug: raw.slug?.trim() || this.slugify(raw.name || ''),
      description: raw.description?.trim() || '',
      categoryId: raw.categoryId || '',
      typeId: raw.typeId || undefined,
      brandId: raw.brandId || undefined,
      price: Number(raw.price) || 0,
      discountPrice: Number(raw.discountPrice) > 0 ? Number(raw.discountPrice) : undefined,
      thumbnail: raw.thumbnail?.trim() || undefined,
      inStock: !!raw.inStock,
      isBestDeal: !!raw.isBestDeal,
      isTrending: !!raw.isTrending,
    };
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
