import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCatalogService } from '../../../core/services/product-catalog.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../shared/models/product.model';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productCatalog = inject(ProductCatalogService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  private routeSub?: Subscription;
  private productsSub?: Subscription;
  private currentProductId = 0;

  product?: Product;
  addedToCart = signal(false);
    addedToWishlist = signal(false);
  selectedImage = '';
  galleryImages: string[] = [];
  galleryStartIndex = 0;
  isLightboxOpen = false;
  activeMediaTab: 'images' | 'videos' = 'images';
  lightboxThumbStartIndex = 0;
  readonly visibleThumbCount = 5;
  similarProducts: Product[] = [];
  accessoryProducts: Product[] = [];

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.currentProductId = Number(params.get('id'));
      this.loadProductState();
    });

    this.productsSub = this.productCatalog.products$.subscribe(() => {
      this.loadProductState();
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.productsSub?.unsubscribe();
  }

  private loadProductState() {
    if (!this.currentProductId) {
      return;
    }

    this.product = this.productCatalog.getProductById(this.currentProductId);
    this.galleryImages = this.buildGalleryImages(this.product);
    this.galleryStartIndex = 0;
    this.selectedImage = this.galleryImages[0] || '';
    this.addedToCart.set(false);

  this.addedToWishlist.set(false);
    if (this.product) {
      this.similarProducts = this.productCatalog.getSimilarProducts(this.product, 4);
      this.accessoryProducts = this.productCatalog.getAccessoryProducts(4);
    } else {
      this.similarProducts = [];
      this.accessoryProducts = [];
    }
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  addToCart() {
    if (!this.product) {
      return;
    }

    this.cartService.addToCart(this.product);
    this.addedToCart.set(true);
  }

  addToWishlist() {
    if (!this.product) {
      return;
    }

    this.wishlistService.addToWishlist(this.product);
    this.addedToWishlist.set(true);
  }

  openLightbox(image?: string) {
    if (image) this.selectedImage = image;
    this.isLightboxOpen = true;
    this.activeMediaTab = 'images';
    this.alignLightboxThumbWindow();
  }

  closeLightbox() {
    this.isLightboxOpen = false;
  }

  setMediaTab(tab: 'images' | 'videos') {
    this.activeMediaTab = tab;
  }

  get visibleLightboxThumbs(): string[] {
    return this.galleryImages.slice(
      this.lightboxThumbStartIndex,
      this.lightboxThumbStartIndex + this.visibleThumbCount
    );
  }

  canLightboxScrollLeft(): boolean {
    return this.lightboxThumbStartIndex > 0;
  }

  canLightboxScrollRight(): boolean {
    return this.lightboxThumbStartIndex + this.visibleThumbCount < this.galleryImages.length;
  }

  scrollLightboxThumbs(direction: 'left' | 'right') {
    if (direction === 'left' && this.canLightboxScrollLeft()) {
      this.lightboxThumbStartIndex = Math.max(0, this.lightboxThumbStartIndex - 1);
    }
    if (direction === 'right' && this.canLightboxScrollRight()) {
      this.lightboxThumbStartIndex = Math.min(
        this.galleryImages.length - this.visibleThumbCount,
        this.lightboxThumbStartIndex + 1
      );
    }
  }

  prevLightboxImage() {
    const current = this.galleryImages.indexOf(this.selectedImage);
    if (current <= 0) return;
    this.selectedImage = this.galleryImages[current - 1];
    this.alignLightboxThumbWindow();
  }

  nextLightboxImage() {
    const current = this.galleryImages.indexOf(this.selectedImage);
    if (current < 0 || current >= this.galleryImages.length - 1) return;
    this.selectedImage = this.galleryImages[current + 1];
    this.alignLightboxThumbWindow();
  }

  private alignLightboxThumbWindow() {
    const current = this.galleryImages.indexOf(this.selectedImage);
    if (current < 0) {
      this.lightboxThumbStartIndex = 0;
      return;
    }

    if (current < this.lightboxThumbStartIndex) {
      this.lightboxThumbStartIndex = current;
    } else if (current >= this.lightboxThumbStartIndex + this.visibleThumbCount) {
      this.lightboxThumbStartIndex = current - this.visibleThumbCount + 1;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isLightboxOpen) this.closeLightbox();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft() {
    if (this.isLightboxOpen && this.activeMediaTab === 'images') this.prevLightboxImage();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight() {
    if (this.isLightboxOpen && this.activeMediaTab === 'images') this.nextLightboxImage();
  }

  get visibleGalleryImages(): string[] {
    return this.galleryImages.slice(this.galleryStartIndex, this.galleryStartIndex + this.visibleThumbCount);
  }

  canScrollLeft(): boolean {
    return this.galleryStartIndex > 0;
  }

  canScrollRight(): boolean {
    return this.galleryStartIndex + this.visibleThumbCount < this.galleryImages.length;
  }

  scrollGallery(direction: 'left' | 'right') {
    if (direction === 'left' && this.canScrollLeft()) {
      this.galleryStartIndex = Math.max(0, this.galleryStartIndex - 1);
    }
    if (direction === 'right' && this.canScrollRight()) {
      this.galleryStartIndex = Math.min(
        this.galleryImages.length - this.visibleThumbCount,
        this.galleryStartIndex + 1
      );
    }
  }

  private buildGalleryImages(product?: Product): string[] {
    if (!product) return [];

    const explicit = (product.gallery || []).filter(Boolean);
    if (explicit.length > 1) return explicit;

    const related = this.productCatalog
      .getProductsByCategorySlug(product.categorySlug || '')
      .filter((p) => p.id !== product.id)
      .map((p) => p.image)
      .filter(Boolean)
      .slice(0, 4);

    const merged = [product.image, ...related];
    return [...new Set(merged)];
  }
}
