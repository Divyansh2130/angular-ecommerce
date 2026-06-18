import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { Carousel } from './carousel';

describe('Carousel', () => {
  let component: Carousel;
  let fixture: ComponentFixture<Carousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carousel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates activeIndex and emits indexChange on scroll', () => {
    const emitSpy = vi.spyOn(component.indexChange, 'emit');
    const nativeElement = {
      scrollLeft: 800,
      offsetWidth: 400,
      scrollTo: vi.fn(),
    };

    component.scrollContainer = {
      nativeElement,
    } as any;

    component.onScroll();

    expect(component.activeIndex).toBe(2);
    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('scrolls to the target card index', () => {
    const scrollToMock = vi.fn();
    const nativeElement = {
      scrollLeft: 0,
      offsetWidth: 300,
      scrollTo: scrollToMock,
    };

    component.scrollContainer = {
      nativeElement,
    } as any;

    component.scrollTo(3);

    expect(scrollToMock).toHaveBeenCalledWith({
      left: 900,
      behavior: 'smooth',
    });
  });
});
