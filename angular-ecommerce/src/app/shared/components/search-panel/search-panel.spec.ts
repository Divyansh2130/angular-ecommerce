import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ProductCatalogService } from '../../../core/services/product-catalog.service';

import { SearchPanel } from './search-panel';

describe('SearchPanel', () => {
  let component: SearchPanel;
  let fixture: ComponentFixture<SearchPanel>;

  const categoryServiceMock = {
    getCategories: () => [
      { id: 1, name: 'Laptop', slug: 'laptop' },
      { id: 2, name: 'Accessories', slug: 'accessories' },
    ],
    categories$: of([]),
  };

  const productCatalogMock = {
    getAllProducts: () => [
      {
        id: 10,
        title: 'Gaming Laptop',
        subtitle: 'Fast and portable',
        price: 1400,
        originalPrice: 1600,
        rating: 4.6,
        image: '/assets/laptop.png',
      },
      {
        id: 20,
        title: 'USB Hub',
        subtitle: 'Accessory',
        price: 35,
        originalPrice: 45,
        rating: 4.1,
        image: '/assets/hub.png',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPanel],
      providers: [
        provideRouter([]),
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: ProductCatalogService, useValue: productCatalogMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters product and category matches from query', async () => {
    fixture.componentRef.setInput('query', 'lap');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.categoryMatches.length).toBe(1);
    expect(component.categoryMatches[0].slug).toBe('laptop');
    expect(component.productMatches.length).toBe(1);
    expect(component.productMatches[0].id).toBe(10);

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Categories');
    expect(text).toContain('Products');
  });

  it('returns no results when query has no match', async () => {
    fixture.componentRef.setInput('query', 'printer');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.hasQuery).toBe(true);
    expect(component.hasResults).toBe(false);

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('No results found for');
  });

  it('shows start typing message with empty query', async () => {
    fixture.componentRef.setInput('query', '');
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Start typing to search products and categories.');
  });

  it('emits event when a result is selected', async () => {
    let emitted = false;
    component.resultSelected.subscribe(() => {
      emitted = true;
    });

    fixture.componentRef.setInput('query', 'lap');
    await fixture.whenStable();
    fixture.detectChanges();

    const firstResult = fixture.nativeElement.querySelector('a');
    firstResult.click();

    expect(emitted).toBe(true);
  });
});
