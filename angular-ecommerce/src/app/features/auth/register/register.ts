import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { MockContentService, AuthStep } from '../../../core/services/mock-content.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = signal(false);
  private authState = inject(AuthStateService);
  private router = inject(Router);
  private contentService = inject(MockContentService);
  private contentSub?: Subscription;

  steps: AuthStep[] = [];
  readonly currentStep = 0;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.steps = content.authSteps || [];
    });
  }

  ngOnDestroy() {
    this.contentSub?.unsubscribe();
  }

  onContinue() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.authState.setEmail(this.registerForm.value.email);
    console.log('Register email:', this.registerForm.value.email);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/auth/verify-email']);
    }, 1200);
  }

  get email() { return this.registerForm.get('email'); }
}
