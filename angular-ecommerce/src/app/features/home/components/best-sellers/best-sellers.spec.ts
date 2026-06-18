import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BestSellers } from './best-sellers';

describe('BestSellers', () => {
  let component: BestSellers;
  let fixture: ComponentFixture<BestSellers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestSellers],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestSellers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
