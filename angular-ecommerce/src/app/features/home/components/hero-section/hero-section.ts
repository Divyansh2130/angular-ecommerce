import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { interval, Subscription } from 'rxjs';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { Category } from '../../../../shared/models/category.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService);
  private contentService = inject(MockContentService);
  private router = inject(Router);

  private readonly categoriesSignal = toSignal(this.categoryService.categories$, {
    initialValue: this.categoryService.getCategories(),
  });
  private readonly content = toSignal(this.contentService.content$, { initialValue: this.contentService.content });
  private readonly heroImagesSignal = computed(() => this.content().heroImages || []);
  readonly currentHeroIndex = signal(0);

  private slideSub?: Subscription;

  get categories(): Category[] {
    return this.categoriesSignal();
  }

  get heroImages(): string[] {
    return this.heroImagesSignal();
  }

  get currentHeroImage(): string {
    const images = this.heroImages;
    if (!images.length) {
      return '';
    }
    return images[this.currentHeroIndex() % images.length] || '';
  }

  ngOnInit(): void {
    this.slideSub = interval(3000).subscribe(() => {
      const images = this.heroImages;
      if (!images.length) {
        return;
      }
      this.currentHeroIndex.update((index) => (index + 1) % images.length);
    });
  }

  ngOnDestroy(): void {
    this.slideSub?.unsubscribe();
  }

  openCategory(slug: string): void {
    this.router.navigate(['/category', slug]);
  }
}
