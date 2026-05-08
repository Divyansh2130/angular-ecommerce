import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { MockContentService, AuthStep } from '../../../core/services/mock-content.service';

function ageValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const dob = new Date(control.value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear() -
    (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
  return age >= 18 ? null : { underage: true };
}

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const repeat = group.get('repeatPassword')?.value;
  return pw === repeat ? null : { mismatch: true };
}

@Component({
  selector: 'app-add-info',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-info.html',
  styleUrl: './add-info.css',
})
export class AddInfo implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private contentService = inject(MockContentService);
  private contentSub?: Subscription;

  authState = inject(AuthStateService);

  steps: AuthStep[] = [];
  readonly currentStep = 2;

  activeTab = signal<'private' | 'business'>('private');
  showPassword = signal(false);
  showRepeat = signal(false);
  isLoading = signal(false);

  privateForm: FormGroup = this.fb.group(
    {
      salutation: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      dob: ['', [Validators.required, ageValidator]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{7,20}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  businessForm: FormGroup = this.fb.group(
    {
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      vatNumber: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{7,20}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit() {
    this.contentSub = this.contentService.content$.subscribe((content) => {
      this.steps = content.authSteps || [];
    });
  }

  ngOnDestroy() {
    this.contentSub?.unsubscribe();
  }

  get activeForm(): FormGroup {
    return this.activeTab() === 'private' ? this.privateForm : this.businessForm;
  }

  setTab(tab: 'private' | 'business') {
    this.activeTab.set(tab);
  }

  togglePassword() { this.showPassword.update(v => !v); }
  toggleRepeat() { this.showRepeat.update(v => !v); }

  f(name: string) { return this.activeForm.get(name); }

  onSubmit() {
    if (this.activeForm.invalid) {
      this.activeForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    console.log('Add info submitted:', this.activeForm.value);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/']);
    }, 1200);
  }
}
