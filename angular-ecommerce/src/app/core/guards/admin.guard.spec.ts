import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { AuthStateService } from '../services/auth-state.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  const authStateMock = {
    authToken: vi.fn<() => string | null>(),
    authUser: vi.fn<() => { role?: string } | null>(),
  };

  const routerMock = {
    navigate: vi.fn<(commands: string[]) => Promise<boolean>>(),
  };

  beforeEach(() => {
    authStateMock.authToken.mockReset();
    authStateMock.authUser.mockReset();
    routerMock.navigate.mockReset();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStateService, useValue: authStateMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('redirects to login when token is missing', () => {
    authStateMock.authToken.mockReturnValue(null);
    authStateMock.authUser.mockReturnValue(null);

    const canActivate = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));

    expect(canActivate).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('redirects to home when user is not admin', () => {
    authStateMock.authToken.mockReturnValue('token-1');
    authStateMock.authUser.mockReturnValue({ role: 'user' });

    const canActivate = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));

    expect(canActivate).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('allows navigation for admin users', () => {
    authStateMock.authToken.mockReturnValue('token-1');
    authStateMock.authUser.mockReturnValue({ role: 'admin' });

    const canActivate = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));

    expect(canActivate).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
