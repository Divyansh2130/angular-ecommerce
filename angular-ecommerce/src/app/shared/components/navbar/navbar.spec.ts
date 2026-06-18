import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthStateService } from '../../../core/services/auth-state.service';

import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  const logoutMock = vi.fn();
  const clearSessionMock = vi.fn();
  const categoriesSubject = new BehaviorSubject([
    { id: 1, name: 'Laptop', slug: 'laptop', image: '/assets/laptop.png' },
    { id: 2, name: 'Accessories', slug: 'accessories', image: '/assets/accessory.png' },
  ]);
  const cartCountSignal = signal(2);
  const wishlistCountSignal = signal(1);
  const authTokenSignal = signal<string | null>('token-123');
  const authUserSignal = signal({
    userId: 'u1',
    name: 'Test User',
    email: 'user@example.com',
    role: 'user',
  });

  beforeEach(async () => {
    logoutMock.mockReset();
    clearSessionMock.mockReset();

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        {
          provide: CategoryService,
          useValue: {
            categories$: categoriesSubject.asObservable(),
          },
        },
        {
          provide: CartService,
          useValue: {
            itemCount: cartCountSignal,
          },
        },
        {
          provide: WishlistService,
          useValue: {
            itemCount: wishlistCountSignal,
          },
        },
        {
          provide: AuthApiService,
          useValue: {
            logout: logoutMock,
          },
        },
        {
          provide: AuthStateService,
          useValue: {
            authToken: authTokenSignal,
            authUser: authUserSignal,
            clearSession: clearSessionMock,
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    authTokenSignal.set('token-123');
    authUserSignal.set({
      userId: 'u1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });
    cartCountSignal.set(2);
    wishlistCountSignal.set(1);
    component.navbarRef = {
      nativeElement: {
        contains: () => true,
      },
    } as any;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens search and stores typed query', () => {
    component.onSearchInput('laptop');

    expect(component.searchQuery()).toBe('laptop');
    expect(component.isSearchOpen()).toBe(true);
    expect(component.isCategoryOpen()).toBe(false);
  });

  it('logs out by calling API and clearing session state', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    logoutMock.mockReturnValue(of({ success: true, message: 'ok' }));

    component.logout();

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(clearSessionMock).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    expect(component.isLoggingOut()).toBe(false);
  });

  it('toggles category and profile menus exclusively', () => {
    component.openSearch();
    component.toggleCategory();
    expect(component.isCategoryOpen()).toBe(true);
    expect(component.isSearchOpen()).toBe(false);

    component.toggleProfileMenu();
    expect(component.isProfileMenuOpen()).toBe(true);
    expect(component.isCategoryOpen()).toBe(false);
    expect(component.isSearchOpen()).toBe(false);
  });

  it('computes login and display helpers', () => {
    expect(component.isLoggedIn()).toBe(true);
    expect(component.displayName()).toBe('Test');
    expect(component.isAdmin()).toBe(false);

    authTokenSignal.set(null);
    authUserSignal.set({
      userId: 'u2',
      name: '  ',
      email: 'x@example.com',
      role: 'admin',
    });

    expect(component.isLoggedIn()).toBe(false);
    expect(component.displayName()).toBe('Account');
    expect(component.isAdmin()).toBe(true);
  });

  it('handles logout error path and still clears session', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    logoutMock.mockReturnValue({
      subscribe: ({ error }: { error: () => void }) => error(),
    });

    component.logout();

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(clearSessionMock).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('does not re-run logout when already in progress', () => {
    component.isLoggingOut.set(true);

    component.logout();

    expect(logoutMock).not.toHaveBeenCalled();
  });

  it('closes menus on outside click', () => {
    component.isCategoryOpen.set(true);
    component.isSearchOpen.set(true);
    component.isProfileMenuOpen.set(true);
    component.navbarRef = {
      nativeElement: {
        contains: () => false,
      },
    } as any;

    component.handleClickOutside({ target: {} } as MouseEvent);

    expect(component.isCategoryOpen()).toBe(false);
    expect(component.isSearchOpen()).toBe(false);
    expect(component.isProfileMenuOpen()).toBe(false);
  });

  it('renders profile menu and admin action in template', () => {
    authUserSignal.set({
      userId: 'u-admin',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    });
    component.toggleProfileMenu();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Admin Panel');
    expect(text).toContain('Hi, Admin');
    expect(text).toContain('Logout');
  });

  it('renders logging out label and cart/wishlist counts', () => {
    component.isLoggingOut.set(true);
    component.isProfileMenuOpen.set(true);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Logging out...');
    expect(text).toContain('2');
    expect(text).toContain('1');
  });

  it('renders page variant category strip', async () => {
    fixture.componentRef.setInput('variant', 'page');
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Deals');
    expect(text).toContain('Laptop');
    expect(text).toContain('Accessories');
  });
});
