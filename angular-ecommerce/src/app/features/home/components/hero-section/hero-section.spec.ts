import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { HeroSection } from './hero-section';
import { CategoryService } from '../../../../core/services/category.service';
import { MockContentService, UiContent } from '../../../../core/services/mock-content.service';
import { Router } from '@angular/router';

describe('HeroSection', () => {
  const categories$ = new BehaviorSubject([] as any[]);
  const content$ = new BehaviorSubject<UiContent>({
    heroImages: ['/assets/hero-a.mp4', '/assets/hero-b.mp4'],
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

  const routerCalls: unknown[][] = [];

  beforeEach(async () => {
    routerCalls.length = 0;

    await TestBed.configureTestingModule({
      imports: [HeroSection],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            categories$,
            getCategories: () => [],
          },
        },
        {
          provide: MockContentService,
          useValue: {
            content$,
            content: content$.value,
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: (...args: unknown[]) => {
              routerCalls.push(args);
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('creates and exposes current hero image', () => {
    const fixture = TestBed.createComponent(HeroSection);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
    expect(component.currentHeroImage).toBe('/assets/hero-a.mp4');
  });

  it('returns empty hero image when source list is empty', () => {
    const fixture = TestBed.createComponent(HeroSection);
    const component = fixture.componentInstance;

    content$.next({
      ...content$.value,
      heroImages: [],
    });

    expect(component.currentHeroImage).toBe('');
  });

  it('navigates to category route', () => {
    const fixture = TestBed.createComponent(HeroSection);
    const component = fixture.componentInstance;

    component.openCategory('laptop');

    expect(routerCalls.length).toBe(1);
    expect(routerCalls[0][0]).toEqual(['/category', 'laptop']);
  });
});
