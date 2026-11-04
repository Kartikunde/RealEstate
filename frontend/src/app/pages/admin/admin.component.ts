import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 mb-2">
            Administrator Console
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Platform Administration
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            System health, platform-wide AUM metrics, user directory, and marketplace listing moderation.
          </p>
        </div>

        <button
          (click)="showAddListingModal.set(true)"
          class="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Publish Marketplace Deal
        </button>
      </div>

      <!-- Admin Platform Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Platform AUM</span>
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            ₹84.60 Cr
          </div>
          <span class="text-xs text-emerald-600 font-semibold">+18.4% this quarter</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Registered Investors</span>
          <div class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            1,420
          </div>
          <span class="text-xs text-slate-500">128 added this month</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Marketplace Listings</span>
          <div class="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {{ marketplaceDeals().length }} Deals
          </div>
          <span class="text-xs text-slate-500">All institutional grade</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly Rent Tracked</span>
          <div class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹48.2 Lakhs
          </div>
          <span class="text-xs text-slate-500">Processed across properties</span>
        </div>
      </div>

      <!-- User Directory Table -->
      <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
              Registered Investors Directory
            </h3>
            <p class="text-xs text-slate-400">User accounts, roles and portfolio activity</p>
          </div>
          <span class="text-xs text-slate-400">Showing {{ users().length }} investors</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3.5 px-4">User</th>
                <th class="py-3.5 px-4">Email</th>
                <th class="py-3.5 px-4">Role</th>
                <th class="py-3.5 px-4">Properties</th>
                <th class="py-3.5 px-4">KYC Status</th>
                <th class="py-3.5 px-4">Joined On</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let u of users()" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {{ u.name }}
                </td>
                <td class="py-3 px-4 text-slate-500">
                  {{ u.email }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    [ngClass]="u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'"
                  >
                    {{ u.role }}
                  </span>
                </td>
                <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  {{ u.propertyCount }} Assets
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    VERIFIED
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-500">
                  {{ u.createdAt | date:'mediumDate' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Marketplace Listings Moderation -->
      <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
              Marketplace Deal Inventory
            </h3>
            <p class="text-xs text-slate-400">Institutional real estate opportunities active on the public exchange</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3.5 px-4">Deal Title</th>
                <th class="py-3.5 px-4">City</th>
                <th class="py-3.5 px-4">Asking Price</th>
                <th class="py-3.5 px-4">Monthly Rent</th>
                <th class="py-3.5 px-4">Gross Yield</th>
                <th class="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let deal of marketplaceDeals()" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {{ deal.title }}
                </td>
                <td class="py-3 px-4 text-slate-500">
                  {{ deal.city }}
                </td>
                <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">
                  {{ deal.price | inrCurrency:'full' }}
                </td>
                <td class="py-3 px-4 text-emerald-600 font-semibold">
                  {{ deal.monthlyRent | inrCurrency:'full' }}
                </td>
                <td class="py-3 px-4 font-extrabold text-blue-600">
                  {{ deal.rentalYield }}%
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    (click)="deleteDeal(deal.id)"
                    class="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove deal"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Listing Modal -->
      <div
        *ngIf="showAddListingModal()"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div class="bg-white dark:bg-[#14213D] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Publish Institutional Marketplace Deal
            </h3>
            <button (click)="showAddListingModal.set(false)" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (ngSubmit)="submitListing()" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Deal Title</label>
              <input
                type="text"
                [(ngModel)]="listingForm.title"
                name="title"
                placeholder="e.g. Prestige Tech Cloud – Grade A Bay"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  [(ngModel)]="listingForm.city"
                  name="city"
                  placeholder="e.g. Bengaluru"
                  required
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Property Type</label>
                <select
                  [(ngModel)]="listingForm.propertyType"
                  name="propertyType"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="COMMERCIAL">Commercial Office</option>
                  <option value="RETAIL">Retail Showroom</option>
                  <option value="WAREHOUSE">Warehouse & Logistics</option>
                  <option value="RESIDENTIAL">High-End Residential</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Asking Price (₹)</label>
                <input
                  type="number"
                  [(ngModel)]="listingForm.price"
                  name="price"
                  required
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  [(ngModel)]="listingForm.monthlyRent"
                  name="monthlyRent"
                  required
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                (click)="showAddListingModal.set(false)"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                Publish Deal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  users = signal<any[]>([
    {
      id: 'usr-1',
      name: 'Vikram Aditya',
      email: 'demo@propvest.in',
      role: 'INVESTOR',
      propertyCount: 3,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'usr-2',
      name: 'PropVest SuperAdmin',
      email: 'admin@propvest.in',
      role: 'ADMIN',
      propertyCount: 0,
      createdAt: new Date('2023-11-01')
    },
    {
      id: 'usr-3',
      name: 'Pooja Hegde',
      email: 'pooja.invest@gmail.com',
      role: 'INVESTOR',
      propertyCount: 5,
      createdAt: new Date('2024-03-22')
    }
  ]);

  marketplaceDeals = signal<any[]>([
    {
      id: 'mkt-1',
      title: 'EON Free Zone – Grade A Office Floor',
      city: 'Pune',
      price: 45000000,
      monthlyRent: 337500,
      rentalYield: 9.0
    },
    {
      id: 'mkt-2',
      title: 'Prestige Tech Pacific – Managed Office Unit',
      city: 'Bengaluru',
      price: 28000000,
      monthlyRent: 210000,
      rentalYield: 9.0
    },
    {
      id: 'mkt-3',
      title: 'Hiranandani Business Park – Retail Showroom',
      city: 'Mumbai',
      price: 62000000,
      monthlyRent: 415000,
      rentalYield: 8.03
    }
  ]);

  showAddListingModal = signal<boolean>(false);

  listingForm = {
    title: 'Mindspace IT Park – Executive Suite',
    city: 'Hyderabad',
    propertyType: 'COMMERCIAL',
    price: 34000000,
    monthlyRent: 255000
  };

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.api.getAdminUsers().subscribe({
      next: (res: any) => {
        if (res.data?.length > 0) {
          this.users.set(res.data);
        }
      },
      error: () => {}
    });
  }

  deleteDeal(id: string): void {
    this.marketplaceDeals.update(prev => prev.filter(d => d.id !== id));
    this.toast.info('Deal removed from marketplace.');
    this.api.deleteMarketplaceListing(id).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  submitListing(): void {
    const annualRent = this.listingForm.monthlyRent * 12;
    const yieldVal = Number(((annualRent / this.listingForm.price) * 100).toFixed(2));

    const newDeal = {
      id: 'mkt-' + Date.now(),
      title: this.listingForm.title,
      city: this.listingForm.city,
      price: this.listingForm.price,
      monthlyRent: this.listingForm.monthlyRent,
      rentalYield: yieldVal
    };

    this.marketplaceDeals.update(prev => [newDeal, ...prev]);
    this.toast.success('Marketplace deal published successfully!');
    this.showAddListingModal.set(false);
  }
}
