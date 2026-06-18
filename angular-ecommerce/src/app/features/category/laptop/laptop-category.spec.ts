import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ProductCatalogService } from '../../../core/services/product-catalog.service';
import { Product } from '../../../shared/models/product.model';
import { LaptopCategory } from './laptop-category';

describe('LaptopCategory', () => {
  let component: LaptopCategory;
  let fixture: ComponentFixture<LaptopCategory>;
  let routerNavigateCalls: unknown[][];
  let paramMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let queryParamMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  const sampleProducts: Product[] = [
    {
      id: 1,
      title: 'Dell XPS',
      price: 1200,
      originalPrice: 1500,
      rating: 4.6,
      image: '/assets/dell.png',
      categorySlug: 'laptop',
      brand: 'Dell',
      inStock: true,
      fastShipping: true,
      ram: '16GB',
      os: 'Windows 11',
      reviews: 20,
      sectionTags: ['listing', 'trending'],
    },
    {
      id: 2,
      title: 'MacBook Air',
      price: 1500,
      originalPrice: 1700,
      rating: 4.8,
      image: '/assets/macbook.png',
      categorySlug: 'laptop',
      brand: 'Apple',
      inStock: true,
      fastShipping: false,
      ram: '8GB',
      os: 'macOS',
      reviews: 30,
      sectionTags: ['listing'],
    },
    {
      id: 3,
      title: 'Acer Gaming Nitro',
      subtitle: 'Gaming beast',
      description: 'Great gaming performance',
      price: 1000,
      originalPrice: 1300,
      rating: 4.9,
      image: '/assets/gaming.png',
      categorySlug: 'laptop',
      brand: 'Acer',
      inStock: false,
      fastShipping: true,
      ram: '32GB',
      os: 'Windows 11',
      reviews: 10,
      discount: '15%',
      sectionTags: ['listing', 'laptop-deals'],
    },
    {
      id: 4,
      title: 'Lenovo Chromebook',
      subtitle: 'Chromebook daily use',
      description: 'Lightweight chromebook',
      price: 500,
      originalPrice: 650,
      rating: 4.1,
      image: '/assets/chromebook.png',
      categorySlug: 'laptop',
      brand: 'Lenovo',
      inStock: true,
      fastShipping: true,
      ram: '8GB',
      os: 'Windows 10',
      reviews: 5,
      sectionTags: ['listing'],
    },
  ];

  beforeEach(async () => {
    routerNavigateCalls = [];
    paramMapSubject = new BehaviorSubject(convertToParamMap({ slug: 'laptop' }));
    queryParamMapSubject = new BehaviorSubject(convertToParamMap({}));

    const routeMock = {
      paramMap: paramMapSubject.asObservable(),
      queryParamMap: queryParamMapSubject.asObservable(),
      snapshot: {
        get queryParamMap() {
          return queryParamMapSubject.value;
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [LaptopCategory],
      providers: [
        {
          provide: ProductCatalogService,
          useValue: {
            getProductsByCategorySlug: (slug: string) =>
              sampleProducts.filter((product) => product.categorySlug === slug),
          },
        },
        { provide: ActivatedRoute, useValue: routeMock },
        {
          provide: Router,
          useValue: {
            navigate: (...args: unknown[]) => {
              routerNavigateCalls.push(args);
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LaptopCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.categoryLabel).toBe('Laptop');
  });

  it('should apply brand from query params', () => {
    queryParamMapSubject.next(convertToParamMap({ brand: 'Dell' }));

    expect(component.selectedBrands.has('Dell')).toBe(true);
    expect(component.filteredProducts.length).toBe(1);
  });

  it('should navigate to product details', () => {
    component.openProduct(2);

    expect(routerNavigateCalls.length).toBe(1);
    expect(routerNavigateCalls[0][0]).toEqual(['/products', 2]);
  });

  it('should apply windows type query', () => {
    queryParamMapSubject.next(convertToParamMap({ type: 'windows laptop' }));

    const ids = component.filteredProducts.map((product) => product.id);
    expect(ids).toContain(1);
    expect(ids).toContain(3);
    expect(ids).toContain(4);
    expect(ids).not.toContain(2);
  });

  it('should apply macbook and deals type modes', () => {
    queryParamMapSubject.next(convertToParamMap({ type: 'macbook' }));
    expect(component.filteredProducts.map((product) => product.id)).toEqual([2]);

    queryParamMapSubject.next(convertToParamMap({ type: 'deals' }));
    const dealIds = component.filteredProducts.map((product) => product.id);
    expect(dealIds).toContain(3);
  });

  it('should apply keyword type mode', () => {
    queryParamMapSubject.next(convertToParamMap({ type: 'chromebook' }));

    expect(component.filteredProducts.map((product) => product.id)).toEqual([4]);
  });

  it('should sort by price and rating', () => {
    component.onSortChange('priceAsc');
    expect(component.filteredProducts[0].id).toBe(4);

    component.onSortChange('priceDesc');
    expect(component.filteredProducts[0].id).toBe(2);

    component.onSortChange('rating');
    expect(component.filteredProducts[0].id).toBe(3);
  });

  it('should filter by availability and fast shipping', () => {
    component.onOnlyAvailableChange(true);
    expect(component.filteredProducts.some((product) => product.id === 3)).toBe(false);

    component.onFastShippingChange(true);
    expect(component.filteredProducts.every((product) => product.fastShipping)).toBe(true);
  });

  it('should toggle filter sets and reset current page', () => {
    component.currentPage = 2;
    component.toggleInSet(component.selectedRam, '16GB', true);

    expect(component.selectedRam.has('16GB')).toBe(true);
    expect(component.currentPage).toBe(1);

    component.toggleInSet(component.selectedRam, '16GB', false);
    expect(component.selectedRam.has('16GB')).toBe(false);
  });

  it('should paginate and handle page boundaries', () => {
    component.pageSize = 2;
    component.currentPage = 1;

    expect(component.totalPages).toBe(2);
    expect(component.paginatedProducts.length).toBe(2);
    expect(component.visibleStart).toBe(1);
    expect(component.visibleEnd).toBe(2);

    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should navigate to home and category page', () => {
    component.openHome();
    component.openCategoryPage();

    expect(routerNavigateCalls[0][0]).toEqual(['/']);
    expect(routerNavigateCalls[1][0]).toEqual(['/category', 'laptop']);
  });
});
