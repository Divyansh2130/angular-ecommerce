import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Login } from './login';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthStateService } from '../../../core/services/auth-state.service';

describe('Login', () => {
  const loginMock = vi.fn();

  beforeEach(async () => {
    loginMock.mockReset();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        {
          provide: AuthApiService,
          useValue: {
            login: loginMock,
          },
        },
      ],
    }).compileComponents();
  });

  it('marks controls as touched and does not navigate on invalid submit', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onSubmit();

    expect(component.email?.touched).toBe(true);
    expect(component.password?.touched).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('stores session and navigates to home on successful login', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const authState = TestBed.inject(AuthStateService);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const sessionSpy = vi.spyOn(authState, 'setSession');

    loginMock.mockReturnValue(
      of({
        success: true,
        message: 'User logged in successfully',
        user: {
          userId: 'u1',
          name: 'Test User',
          email: 'user@example.com',
          role: 'user',
        },
        token: 'fake-token',
      })
    );

    component.loginForm.setValue({
      email: 'user@example.com',
      password: 'secret123',
    });

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(sessionSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('shows api error and does not navigate when login fails', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    loginMock.mockReturnValue(
      throwError(() => ({
        error: { message: 'Invalid email or password' },
      }))
    );

    component.loginForm.setValue({
      email: 'user@example.com',
      password: 'wrongpass',
    });

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.apiError()).toBe('Invalid email or password');
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
