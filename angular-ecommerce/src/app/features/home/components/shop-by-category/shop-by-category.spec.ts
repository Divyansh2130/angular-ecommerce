import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopByCategory } from './shop-by-category';

describe('ShopByCategory', () => {
  let component: ShopByCategory;
  let fixture: ComponentFixture<ShopByCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopByCategory]
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
