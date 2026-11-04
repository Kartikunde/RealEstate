import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1120] px-4 py-12 transition-colors">
      <div class="max-w-md w-full space-y-8">
        <!-- Brand Header -->
        <div class="text-center">
          <a routerLink="/" class="inline-flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <span class="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">PropVest</span>
          </a>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white font-heading">Reset your password</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Enter your registered email address</p>
        </div>

        <!-- Card Container -->
        <div class="bg-white dark:bg-[#14213D] p-8 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          <!-- Success Notice -->
          <div *ngIf="successMessage()" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
            <div class="flex items-center font-bold">
              <svg class="w-4 h-4 mr-1.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Request Processed
            </div>
            <p>{{ successMessage() }}</p>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage()" class="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start">
            <svg class="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>

          <!-- Form -->
          <form *ngIf="!successMessage()" [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="name@example.com"
                class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
                [ngClass]="{'border-red-500': isFieldInvalid('email')}"
              />
              <p *ngIf="isFieldInvalid('email')" class="text-[11px] text-red-500 mt-1">
                Please enter a valid email address.
              </p>
            </div>

            <button
              type="submit"
              [disabled]="loading() || forgotForm.invalid"
              class="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <svg *ngIf="loading()" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading() ? 'Sending...' : 'Request Password Reset' }}</span>
            </button>
          </form>

          <!-- Back to Login Link -->
          <div class="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            <a routerLink="/login" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.forgotForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.successMessage.set(
          res.message || 'If an account exists with this email, reset instructions have been issued. (In demo environment: use Demo@123).'
        );
        this.toast.info('Password Reset', 'Instructions recorded.');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Could not submit password reset request. Please check server connectivity.');
      },
    });
  }
}
