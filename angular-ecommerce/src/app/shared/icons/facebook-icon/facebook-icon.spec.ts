import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookIcon } from './facebook-icon';

describe('FacebookIcon', () => {
  let component: FacebookIcon;
  let fixture: ComponentFixture<FacebookIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
