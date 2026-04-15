import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaptopBrands } from './laptop-brands';

describe('LaptopBrands', () => {
  let component: LaptopBrands;
  let fixture: ComponentFixture<LaptopBrands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaptopBrands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaptopBrands);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
