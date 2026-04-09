import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBrands } from './top-brands';

describe('TopBrands', () => {
  let component: TopBrands;
  let fixture: ComponentFixture<TopBrands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBrands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBrands);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
