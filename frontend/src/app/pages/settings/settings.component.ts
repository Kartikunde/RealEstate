import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
          System & App Settings
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize UI theme, currency display, alerts preferences, and privacy controls.
        </p>
      </div>

      <!-- Settings Cards -->
      <div class="space-y-6">
        <!-- 1. Theme & Appearance -->
        <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Theme & Interface</h3>
              <p class="text-xs text-slate-500">Select your preferred dashboard visual theme</p>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <button
              (click)="setTheme('light')"
              class="p-4 rounded-xl border text-center transition-all"
              [ngClass]="currentTheme === 'light' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-700'"
            >
              <div class="text-xs font-bold text-slate-900 dark:text-white">☀️ Light Theme</div>
              <p class="text-[10px] text-slate-400 mt-1">Crisp high-contrast day mode</p>
            </button>
            <button
              (click)="setTheme('dark')"
              class="p-4 rounded-xl border text-center transition-all"
              [ngClass]="currentTheme === 'dark' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30' : 'border-slate-200 dark:border-slate-700'"
            >
              <div class="text-xs font-bold text-slate-900 dark:text-white">🌙 Dark Mode</div>
              <p class="text-[10px] text-slate-400 mt-1">Deep Navy FinTech theme</p>
            </button>
          </div>
        </div>

        <!-- 2. Currency & Locale -->
        <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Currency & Financial Formatting</h3>
              <p class="text-xs text-slate-500">Default reporting currency and number units</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Base Currency</label>
              <select class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Financial Number System</label>
              <select class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                <option value="LAKH_CRORE">Indian System (Lakhs & Crores: ₹1,25,00,000)</option>
                <option value="MILLIONS">International System (Millions & Billions)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 3. Notification Preferences -->
        <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Alerts & Notifications</h3>
              <p class="text-xs text-slate-500">Configure what triggers emails, SMS, or dashboard alerts</p>
            </div>
          </div>

          <div class="space-y-3 pt-2 text-xs">
            <label class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
              <div>
                <span class="font-bold text-slate-900 dark:text-white block">Rent Collection Alerts</span>
                <span class="text-slate-400">Instant notification when tenant credits monthly rental</span>
              </div>
              <input type="checkbox" [(ngModel)]="notifs.rent" (ngModelChange)="saveSettings()" class="w-4 h-4 accent-blue-600 rounded"/>
            </label>

            <label class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
              <div>
                <span class="font-bold text-slate-900 dark:text-white block">Home Loan EMI Advance Reminders</span>
                <span class="text-slate-400">Receive alert 3 days prior to NACH auto-debit</span>
              </div>
              <input type="checkbox" [(ngModel)]="notifs.emi" (ngModelChange)="saveSettings()" class="w-4 h-4 accent-blue-600 rounded"/>
            </label>

            <label class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
              <div>
                <span class="font-bold text-slate-900 dark:text-white block">Marketplace High-Yield Deal Alerts</span>
                <span class="text-slate-400">Notify when new institutional listings with &gt;8% yield are published</span>
              </div>
              <input type="checkbox" [(ngModel)]="notifs.marketplace" (ngModelChange)="saveSettings()" class="w-4 h-4 accent-blue-600 rounded"/>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  currentTheme = 'light';

  notifs = {
    rent: true,
    emi: true,
    marketplace: true
  };

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    const isDark = document.documentElement.classList.contains('dark');
    this.currentTheme = isDark ? 'dark' : 'light';
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('propvest_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('propvest_theme', 'light');
    }
    this.toast.info(`Switched to ${theme} theme.`);
  }

  saveSettings(): void {
    this.toast.success('Notification preferences updated.');
  }
}
