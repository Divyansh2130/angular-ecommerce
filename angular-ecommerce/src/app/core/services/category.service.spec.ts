import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const baseCategories = [
    { id: 1, name: 'Laptop', slug: 'laptop', image: '/assets/laptop.png' },
    { id: 2, name: 'Monitor', slug: 'monitor', image: '/assets/monitor.png' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();

    const assetRequest = httpMock.expectOne('assets/data/categories.json');
    expect(assetRequest.request.method).toBe('GET');
    assetRequest.flush(baseCategories);

    const backendRequest = httpMock.expectOne('http://localhost:5000/api/categories?limit=100');
    expect(backendRequest.request.method).toBe('GET');
    backendRequest.flush({
      success: true,
      categories: [],
    });

    expect(service.getCategories().length).toBe(2);
  });

  it('hydrates categories from backend and preserves ids from base categories', () => {
    const assetRequest = httpMock.expectOne('assets/data/categories.json');
    assetRequest.flush(baseCategories);

    const backendRequest = httpMock.expectOne('http://localhost:5000/api/categories?limit=100');
    backendRequest.flush({
      success: true,
      categories: [
        { _id: 'b1', name: 'Gaming Laptops', slug: 'laptops', image: '/assets/new-laptop.png' },
      ],
    });

    const categories = service.getCategories();
    expect(categories.length).toBe(1);
    expect(categories[0].id).toBe(1);
    expect(categories[0].backendId).toBe('b1');
    expect(categories[0].name).toBe('Gaming Laptops');
  });

  it('falls back to base categories when backend request fails', () => {
    const assetRequest = httpMock.expectOne('assets/data/categories.json');
    assetRequest.flush(baseCategories);

    const backendRequest = httpMock.expectOne('http://localhost:5000/api/categories?limit=100');
    backendRequest.flush({ message: 'error' }, { status: 500, statusText: 'Server Error' });

    const categories = service.getCategories();
    expect(categories.length).toBe(2);
    expect(categories[0].name).toBe('Laptop');
  });

  it('sets categories empty when local asset request fails', () => {
    const assetRequest = httpMock.expectOne('assets/data/categories.json');
    assetRequest.flush({ message: 'missing' }, { status: 404, statusText: 'Not Found' });

    expect(service.getCategories()).toEqual([]);
  });
});
