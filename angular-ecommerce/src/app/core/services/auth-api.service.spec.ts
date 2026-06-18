import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('posts login payload to login endpoint', () => {
    service
      .login({
        email: 'user@example.com',
        password: 'secret123',
      })
      .subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.user.email).toBe('user@example.com');
      });

    const request = httpMock.expectOne('http://localhost:5000/api/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'user@example.com',
      password: 'secret123',
    });

    request.flush({
      success: true,
      message: 'Login successful',
      user: {
        userId: 'u1',
        name: 'Test User',
        email: 'user@example.com',
        role: 'user',
      },
      token: 'token-1',
    });
  });

  it('posts signup payload to signup endpoint', () => {
    service
      .signup({
        name: 'New User',
        email: 'new@example.com',
        password: 'secret123',
        confirmPassword: 'secret123',
        role: 'admin',
      })
      .subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.user.role).toBe('admin');
      });

    const request = httpMock.expectOne('http://localhost:5000/api/auth/signup');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.name).toBe('New User');
    expect(request.request.body.role).toBe('admin');

    request.flush({
      success: true,
      message: 'Signup successful',
      user: {
        userId: 'u2',
        name: 'New User',
        email: 'new@example.com',
        role: 'admin',
      },
      token: 'token-2',
    });
  });

  it('posts empty body to logout endpoint', () => {
    service.logout().subscribe((response) => {
      expect(response.success).toBe(true);
      expect(response.message).toBe('Logged out');
    });

    const request = httpMock.expectOne('http://localhost:5000/api/auth/logout');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({});

    request.flush({
      success: true,
      message: 'Logged out',
    });
  });
});
