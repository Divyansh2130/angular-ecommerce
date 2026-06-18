import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MockContentService, UiContent } from '../../core/services/mock-content.service';

import { Category } from './category';

const emptyContent: UiContent = {
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
};

describe('Category', () => {
  let component: Category;
  let fixture: ComponentFixture<Category>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Category],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new BehaviorSubject(convertToParamMap({ name: 'laptop' })).asObservable(),
          },
        },
        {
          provide: MockContentService,
          useValue: {
            content$: new BehaviorSubject<UiContent>(emptyContent).asObservable(),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Category);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
