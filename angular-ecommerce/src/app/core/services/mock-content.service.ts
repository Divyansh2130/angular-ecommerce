import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { BlogInterface } from '../../shared/models/blog.model';
import { Category } from '../../shared/models/category.model';
import { FAQ } from '../../shared/models/faq.model';
import { Type } from '../../shared/models/type.model';
import { FeatureStripItem } from '../../shared/components/feature-strip/feature-strip';

export interface BrandIcon {
  name?: string;
  icon: string;
}

export interface AuthStep {
  label: string;
  icon: string;
}

export interface UiContent {
  heroImages: string[];
  shopByCategories: Category[];
  homeBlogs: BlogInterface[];
  topBrands: BrandIcon[];
  laptopBrands: BrandIcon[];
  sharedFeatureStrip: FeatureStripItem[];
  categoryTypesMap: Record<string, Type[]>;
  categoryFaqsMap: Record<string, FAQ[]>;
  categoryBlogsMap: Record<string, BlogInterface[]>;
  authSteps: AuthStep[];
}

@Injectable({
  providedIn: 'root',
})
export class MockContentService {
  private readonly http = inject(HttpClient);
  private readonly contentSubject = new BehaviorSubject<UiContent>({
    heroImages: [],
    shopByCategories: [],
    homeBlogs: [],
    topBrands: [],
    laptopBrands: [],
    sharedFeatureStrip: [],
    categoryTypesMap: {},
    categoryFaqsMap: {},
    categoryBlogsMap: {},
    authSteps: [],
  });

  readonly content$ = this.contentSubject.asObservable();

  constructor() {
    this.http.get<UiContent>('assets/data/ui-content.json').subscribe({
      next: (content) => this.contentSubject.next(content),
      error: () => this.contentSubject.next(this.contentSubject.value),
    });
  }

  get content(): UiContent {
    return this.contentSubject.value;
  }
}
