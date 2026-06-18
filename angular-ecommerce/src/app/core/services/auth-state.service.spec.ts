import { TestBed } from '@angular/core/testing';

import { AuthStateService } from './auth-state.service';

describe('AuthStateService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('initializes token and user from localStorage', () => {
    localStorage.setItem('auth_token', 'token-1');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        userId: 'u1',
        name: 'User One',
        email: 'user1@example.com',
        role: 'admin',
      })
    );

    const service = TestBed.inject(AuthStateService);

    expect(service.authToken()).toBe('token-1');
    expect(service.authUser()?.name).toBe('User One');
    expect(service.authUser()?.role).toBe('admin');
  });

  it('cleans invalid stored user json safely', () => {
    localStorage.setItem('auth_token', 'token-2');
    localStorage.setItem('auth_user', '{broken-json');

    const service = TestBed.inject(AuthStateService);

    expect(service.authToken()).toBe('token-2');
    expect(service.authUser()).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });

  it('stores registration email', () => {
    const service = TestBed.inject(AuthStateService);

    service.setEmail('newuser@example.com');

    expect(service.registrationEmail()).toBe('newuser@example.com');
  });

  it('sets and clears session with persistence', () => {
    const service = TestBed.inject(AuthStateService);

    service.setSession('token-3', {
      userId: 'u3',
      name: 'User Three',
      email: 'user3@example.com',
      role: 'user',
    });

    expect(service.authToken()).toBe('token-3');
    expect(service.authUser()?.email).toBe('user3@example.com');
    expect(localStorage.getItem('auth_token')).toBe('token-3');
    expect(localStorage.getItem('auth_user')).toContain('user3@example.com');

    service.clearSession();

    expect(service.authToken()).toBe('');
    expect(service.authUser()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });
});
