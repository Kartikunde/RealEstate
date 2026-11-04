import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Notification } from '../../core/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Notifications & Alerts
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay on top of rent dues, automated EMI debits, lease expiration notices, and deal updates.
          </p>
        </div>

        <button
          (click)="markAllRead()"
          class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all self-start sm:self-auto shadow-sm"
        >
          <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Mark All as Read
        </button>
      </div>

      <!-- Notification Feed List -->
      <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        <div
          *ngFor="let n of notifications()"
          class="p-4 sm:p-5 flex items-start space-x-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
          [ngClass]="{ 'bg-blue-50/30 dark:bg-blue-950/20': !n.isRead }"
        >
          <!-- Category Icon -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            [ngClass]="{
              'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400': n.category === 'RENT',
              'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400': n.category === 'SYSTEM',
              'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400': n.category === 'LOAN',
              'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400': n.category === 'EXPENSE'
            }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>

          <!-- Body -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white" [ngClass]="{ 'font-extrabold': !n.isRead }">
                {{ n.title }}
              </h4>
              <span class="text-[11px] text-slate-400 whitespace-nowrap">
                {{ n.createdAt | date:'shortTime' }}
              </span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {{ n.message }}
            </p>
          </div>

          <!-- Actions -->
          <button
            *ngIf="!n.isRead"
            (click)="markAsRead(n)"
            class="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
          >
            Mark read
          </button>
        </div>
      </div>
    </div>
  `,
})
export class NotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([
    {
      id: 'notif-1',
      title: 'Monthly Rent Credited – DLF Cybercity',
      message: '₹2,15,000 has been received from S&P Global for November 2024 via NEFT.',
      category: 'RENT',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45) // 45m ago
    },
    {
      id: 'notif-2',
      title: 'Home Loan EMI Debited – HDFC Bank',
      message: '₹56,430 has been successfully debited towards loan account HL-BLR-840291.',
      category: 'LOAN',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 180) // 3h ago
    },
    {
      id: 'notif-3',
      title: 'Upcoming Lease Renewal Reminder',
      message: 'Tenant lease for Rahul Kulkarni (Sobha Dream Acres) expires on 31 Dec 2024 (57 days remaining).',
      category: 'RENT',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      id: 'notif-4',
      title: 'Marketplace Price Update – Powai High Street',
      message: 'A seller adjusted the asking price for Hiranandani Business Park Retail Showroom to ₹6.20 Cr.',
      category: 'SYSTEM',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
    }
  ]);

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.api.getNotifications().subscribe({
      next: (res) => {
        if (res.data?.notifications?.length > 0) {
          this.notifications.set(res.data.notifications);
        }
      },
      error: () => {}
    });
  }

  markAsRead(n: Notification): void {
    n.isRead = true;
    this.api.markNotificationAsRead(n.id).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  markAllRead(): void {
    this.notifications.update(prev => prev.map(n => ({ ...n, isRead: true })));
    this.toast.success('All notifications marked as read.');
    this.api.markAllNotificationsAsRead().subscribe({
      next: () => {},
      error: () => {}
    });
  }
}
