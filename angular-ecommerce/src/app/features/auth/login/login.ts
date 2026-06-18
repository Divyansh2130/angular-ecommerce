import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthStateService } from '../../../core/services/auth-state.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  apiError = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authApi: AuthApiService,
    private authState: AuthStateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.apiError.set('');
    this.isLoading.set(true);
    this.authApi.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.authState.setSession(response.token, response.user);
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.apiError.set(error.error?.message || 'Unable to login. Please try again.');
      },
    });
  }

  onGoogleLogin() {
    // TODO: integrate Google OAuth
    console.log('Google login initiated');
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
