import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { interval, Subscription } from 'rxjs';
import { MockContentService } from '../../../../core/services/mock-content.service';
import { Category } from '../../../../shared/models/category.model';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService);
  private contentService = inject(MockContentService);
  private router = inject(Router);

  categories: Category[] = [];
  heroImages: string[] = [];
  currentHeroIndex = 0;

  private slideSub?: Subscription;
  private categoriesSub?: Subscription;
  private contentSub?: Subscription;

  get currentHeroImage(): string {
    return this.heroImages[this.currentHeroIndex] || '';
  }

  ngOnInit(): void {
    this.categoriesSub = this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
    });

    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.heroImages = content.heroImages || [];
      if (this.currentHeroIndex >= this.heroImages.length) {
        this.currentHeroIndex = 0;
      }
    });

    this.slideSub = interval(3000).subscribe(() => {
      if (!this.heroImages.length) {
        return;
      }
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroImages.length;
    });
  }

  ngOnDestroy(): void {
    this.slideSub?.unsubscribe();
    this.categoriesSub?.unsubscribe();
    this.contentSub?.unsubscribe();
  }

  openCategory(slug: string): void {
    this.router.navigate(['/category', slug]);
  }
}
