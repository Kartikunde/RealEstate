import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { WatchlistItem } from '../../core/models';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Saved Watchlist
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and monitor high-yield commercial real estate opportunities shortlisted from the PropVest marketplace.
          </p>
        </div>

        <a
          routerLink="/marketplace"
          class="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Explore More Opportunities
        </a>
      </div>

      <!-- Empty State -->
      <div *ngIf="items().length === 0" class="text-center py-16 bg-white dark:bg-[#14213D] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-4">
        <div class="w-16 h-16 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Your watchlist is empty</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          Bookmark pre-leased commercial offices, retail shops, or rental apartments from the marketplace to track yields and cap rates.
        </p>
        <a
          routerLink="/marketplace"
          class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
        >
          Browse Marketplace
        </a>
      </div>

      <!-- Watchlist Grid -->
      <div *ngIf="items().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let item of items()"
          class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all"
        >
          <!-- Image -->
          <div class="relative h-48 w-full overflow-hidden bg-slate-900">
            <img
              [src]="item.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80'"
              [alt]="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            <div class="absolute top-3 left-3 flex gap-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
                {{ item.propertyType }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white">
                {{ item.rentalYield }}% Yield
              </span>
            </div>

            <button
              (click)="removeItem(item.id, item.title)"
              class="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-rose-600 text-white transition-colors"
              title="Remove from watchlist"
            >
              <svg class="w-4 h-4 fill-current text-rose-500 hover:text-white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
            </button>

            <div class="absolute bottom-3 left-3 right-3 text-white">
              <p class="text-xs text-slate-200 flex items-center">
                <svg class="w-3.5 h-3.5 mr-1 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                {{ item.location }}, {{ item.city }}
              </p>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white text-base font-heading">
                {{ item.title }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Leased to <strong class="text-slate-800 dark:text-slate-200">{{ item.tenant || 'Corporate Tenant' }}</strong> • {{ item.areaSqFt }} sq.ft
              </p>
            </div>

            <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold">Asking Price</span>
                <p class="text-sm font-extrabold text-slate-900 dark:text-white">
                  {{ item.price | inrCurrency:'full' }}
                </p>
              </div>
              <div class="text-right">
                <span class="text-slate-400 text-[10px] uppercase font-bold">Monthly Rental</span>
                <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {{ item.monthlyRent | inrCurrency:'full' }}/mo
                </p>
              </div>
            </div>

            <div class="pt-2 flex items-center space-x-2">
              <a
                routerLink="/marketplace"
                class="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-center text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                Inquire Deal
              </a>
              <button
                (click)="removeItem(item.id, item.title)"
                class="py-2 px-3 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WatchlistComponent implements OnInit {
  items = signal<WatchlistItem[]>([
    {
      id: 'wl-1',
      listingId: 'mkt-2',
      title: 'Prestige Tech Pacific – Managed Office Unit',
      propertyType: 'COMMERCIAL',
      city: 'Bengaluru',
      location: 'Whitefield',
      price: 28000000,
      monthlyRent: 210000,
      rentalYield: 9.0,
      areaSqFt: 2200,
      tenant: 'Cognizant Technology',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
      addedAt: new Date()
    },
    {
      id: 'wl-2',
      listingId: 'mkt-4',
      title: 'DLF Cyber City Phase 3 – Tech Studio',
      propertyType: 'COMMERCIAL',
      city: 'Gurugram',
      location: 'Cyber City Sector 24',
      price: 52000000,
      monthlyRent: 375000,
      rentalYield: 8.65,
      areaSqFt: 2900,
      tenant: 'S&P Global Solutions',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1000&auto=format&fit=crop&q=80',
      addedAt: new Date()
    }
  ]);

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.api.getWatchlist().subscribe({
      next: (res) => {
        if (res.data?.length > 0) {
          this.items.set(res.data);
        }
      },
      error: () => {}
    });
  }

  removeItem(id: string, title?: string): void {
    const name = title || 'Deal';
    this.items.update(prev => prev.filter(i => i.id !== id));
    this.toast.info(`"${name}" removed from your watchlist.`);
    this.api.removeFromWatchlist(id).subscribe({
      next: () => {},
      error: () => {}
    });
  }
}
