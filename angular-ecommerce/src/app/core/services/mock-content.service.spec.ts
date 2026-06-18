import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MockContentService, UiContent } from './mock-content.service';

describe('MockContentService', () => {
  let service: MockContentService;
  let httpMock: HttpTestingController;

  const sampleContent: UiContent = {
    heroImages: ['/assets/hero-1.png', '/assets/hero-2.png'],
    shopByCategories: [],
    homeBlogs: [],
    topBrands: [],
    laptopBrands: [],
    sharedFeatureStrip: [],
    categoryTypesMap: {},
    categoryFaqsMap: {},
    categoryBlogsMap: {},
    authSteps: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MockContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads content from backend when available', () => {
    const backendRequest = httpMock.expectOne('http://localhost:5000/api/content');
    backendRequest.flush({
      success: true,
      content: sampleContent,
    });

    expect(service.content.heroImages.length).toBe(2);
    expect(service.content.heroImages[0]).toBe('/assets/hero-1.png');
  });

  it('falls back to local json when backend fails', () => {
    const backendRequest = httpMock.expectOne('http://localhost:5000/api/content');
    backendRequest.flush({ message: 'failed' }, { status: 500, statusText: 'Server Error' });

    const localRequest = httpMock.expectOne('assets/data/ui-content.json');
    localRequest.flush(sampleContent);

    expect(service.content.heroImages.length).toBe(2);
    expect(service.content.heroImages[1]).toBe('/assets/hero-2.png');
  });

  it('keeps default empty content when backend and local fallback fail', () => {
    const backendRequest = httpMock.expectOne('http://localhost:5000/api/content');
    backendRequest.flush({ message: 'failed' }, { status: 500, statusText: 'Server Error' });

    const localRequest = httpMock.expectOne('assets/data/ui-content.json');
    localRequest.flush({ message: 'missing' }, { status: 404, statusText: 'Not Found' });

    expect(service.content.heroImages).toEqual([]);
    expect(service.content.shopByCategories).toEqual([]);
  });
});
