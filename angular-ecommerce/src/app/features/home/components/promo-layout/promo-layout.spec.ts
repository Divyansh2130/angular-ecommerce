import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoLayout } from './promo-layout';

describe('PromoLayout', () => {
  let component: PromoLayout;
  let fixture: ComponentFixture<PromoLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
