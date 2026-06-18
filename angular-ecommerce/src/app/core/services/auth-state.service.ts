import { Injectable, signal } from '@angular/core';
import { AuthUser } from './auth-api.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  registrationEmail = signal<string>('');
  authToken = signal<string>(this.readToken());
  authUser = signal<AuthUser | null>(this.readUser());

  setEmail(email: string) {
    this.registrationEmail.set(email);
  }

  setSession(token: string, user: AuthUser) {
    this.authToken.set(token);
    this.authUser.set(user);
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearSession() {
    this.authToken.set('');
    this.authUser.set(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private readToken(): string {
    return localStorage.getItem(this.tokenKey) ?? '';
  }

  private readUser(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
