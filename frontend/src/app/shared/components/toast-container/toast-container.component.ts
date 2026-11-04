import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="pointer-events-auto flex items-start p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0"
        [ngClass]="{
          'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100': toast.type === 'success',
          'bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100': toast.type === 'error',
          'bg-blue-50 dark:bg-blue-950/80 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100': toast.type === 'info',
          'bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100': toast.type === 'warning'
        }"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 mt-0.5 mr-3">
          <!-- Success -->
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <!-- Error -->
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <!-- Info -->
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <!-- Warning -->
          <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 mr-2">
          <p class="text-sm font-semibold leading-tight">{{ toast.title }}</p>
          <p *ngIf="toast.message" class="text-xs mt-1 opacity-90">{{ toast.message }}</p>
        </div>

        <!-- Close -->
        <button
          (click)="toastService.remove(toast.id)"
          class="flex-shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
