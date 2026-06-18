import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ShopByCategory } from './shop-by-category';

describe('ShopByCategory', () => {
  let component: ShopByCategory;
  let fixture: ComponentFixture<ShopByCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopByCategory],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopByCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
