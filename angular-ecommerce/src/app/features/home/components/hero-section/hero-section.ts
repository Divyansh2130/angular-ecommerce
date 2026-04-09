import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../../../core/services/category.service';
import { interval, Subscription } from 'rxjs';
interface Category {
  name: string;
  image?: string;
}

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection implements OnInit, OnDestroy {
  private categoryServices = inject(CategoryService);
  categories: Category[] = this.categoryServices.getCategories();

  heroImages: string[] = [
    '/assets/images/home/lady_listening_2.png',
  ];
  currentHeroIndex = 0;
  private heroRotationTimer:any;

  get currentHeroImage(): string {
    console.log('Get called:', this.currentHeroIndex);
    return this.heroImages[this.currentHeroIndex];
  }

  private sub!: Subscription;

  ngOnInit(): void {
    this.sub = interval(1000).subscribe(() => {
    this.currentHeroIndex =
      (this.currentHeroIndex + 1) % this.heroImages.length;
  });
  }

  ngOnDestroy(): void {
     this.sub.unsubscribe();
  }
}
