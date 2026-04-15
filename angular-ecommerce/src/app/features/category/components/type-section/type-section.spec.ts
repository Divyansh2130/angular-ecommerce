import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeSection } from './type-section';

describe('TypeSection', () => {
  let component: TypeSection;
  let fixture: ComponentFixture<TypeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
