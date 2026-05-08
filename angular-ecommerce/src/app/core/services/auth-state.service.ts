import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  registrationEmail = signal<string>('');

  setEmail(email: string) {
    this.registrationEmail.set(email);
  }
}
