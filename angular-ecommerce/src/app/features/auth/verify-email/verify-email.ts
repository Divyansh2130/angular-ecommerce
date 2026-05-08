import {
  Component,
  signal,
  inject,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { MockContentService, AuthStep } from '../../../core/services/mock-content.service';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail implements AfterViewInit, OnInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  private authState = inject(AuthStateService);
  private router = inject(Router);
  private contentService = inject(MockContentService);
  private contentSub?: Subscription;

  email = this.authState.registrationEmail;
  digits = signal<string[]>(['', '', '', '', '', '']);
  isLoading = signal(false);
  resendCooldown = signal(0);

  steps: AuthStep[] = [];
  readonly currentStep = 1;

  ngOnInit() {
    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.steps = content.authSteps || [];
    });
  }

  ngOnDestroy() {
    this.contentSub?.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => this.otpInputs.first?.nativeElement.focus(), 50);
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(-1);
    input.value = val;
    const updated = [...this.digits()];
    updated[index] = val;
    this.digits.set(updated);

    if (val && index < 5) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const updated = [...this.digits()];
      if (updated[index]) {
        updated[index] = '';
        this.digits.set(updated);
      } else if (index > 0) {
        this.otpInputs.get(index - 1)?.nativeElement.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? '';
    const updated = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, i) => (updated[i] = ch));
    this.digits.set(updated);
    this.otpInputs.forEach((ref, i) => (ref.nativeElement.value = updated[i]));
    const nextEmpty = updated.findIndex((d) => !d);
    const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
    this.otpInputs.get(focusIdx)?.nativeElement.focus();
  }

  isComplete() {
    return this.digits().every((d) => d !== '');
  }

  onContinue() {
    if (!this.isComplete()) return;
    this.isLoading.set(true);
    const code = this.digits().join('');
    console.log('OTP submitted:', code);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/auth/add-info']);
    }, 1200);
  }

  onChangeEmail() {
    this.router.navigate(['/auth/register']);
  }

  onResend() {
    if (this.resendCooldown() > 0) return;
    console.log('Resending OTP to', this.email());
    this.resendCooldown.set(60);
    const interval = setInterval(() => {
      this.resendCooldown.update((v) => {
        if (v <= 1) { clearInterval(interval); return 0; }
        return v - 1;
      });
    }, 1000);
  }
}
