import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] flex items-center justify-center p-4">
      <div class="max-w-md w-full text-center space-y-6">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-xl border border-blue-100 dark:border-blue-900/50">
          <span class="text-3xl font-extrabold font-heading">404</span>
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Asset Not Found
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            The page or portfolio record you are trying to reach does not exist or may have been relocated.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            routerLink="/dashboard"
            class="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all text-center"
          >
            Return to Dashboard
          </a>
          <a
            routerLink="/marketplace"
            class="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors text-center"
          >
            Explore Marketplace
          </a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
