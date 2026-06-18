import { BehaviorSubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { Register } from './register';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { MockContentService, UiContent } from '../../../core/services/mock-content.service';

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

describe('Register', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        {
          provide: MockContentService,
          useValue: {
            content$: new BehaviorSubject<UiContent>(emptyContent).asObservable(),
          },
        },
      ],
    }).compileComponents();
  });

  it('marks email as touched and blocks navigation on invalid submit', () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onContinue();

    expect(component.email?.touched).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('stores registration email and routes to verify-email when valid', () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const authState = TestBed.inject(AuthStateService);
    const navigateSpy = vi.spyOn(router, 'navigate');
    vi.useFakeTimers();

    component.registerForm.setValue({ email: 'newuser@example.com' });
    component.onContinue();

    expect(component.isLoading()).toBe(true);
    expect(authState.registrationEmail()).toBe('newuser@example.com');

    vi.advanceTimersByTime(1200);

    expect(component.isLoading()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/verify-email']);
    vi.useRealTimers();
  });
});
