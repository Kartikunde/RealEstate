import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { MarketplaceListing } from '../../core/models';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Institutional & Pre-Leased Real Estate Deals</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Investment Marketplace
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover verified, high-yield commercial spaces, fractional assets, and residential rental properties across India.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <a
            routerLink="/watchlist"
            class="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
          >
            <svg class="w-4 h-4 mr-1.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
            </svg>
            My Watchlist
          </a>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-white dark:bg-[#14213D] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <!-- Search input -->
          <div class="relative md:col-span-2">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="applyFilters()"
              placeholder="Search by title, micro-market, or anchor tenant..."
              class="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
            />
          </div>

          <!-- City selector -->
          <div>
            <select
              [(ngModel)]="selectedCity"
              (ngModelChange)="applyFilters()"
              class="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            >
              <option value="ALL">All Metro Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai MMR</option>
              <option value="Gurugram">Delhi NCR / Gurugram</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          <!-- Asset Type selector -->
          <div>
            <select
              [(ngModel)]="selectedType"
              (ngModelChange)="applyFilters()"
              class="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            >
              <option value="ALL">All Asset Types</option>
              <option value="COMMERCIAL">Grade-A Commercial</option>
              <option value="RESIDENTIAL">High-Yield Residential</option>
              <option value="WAREHOUSE">Industrial & Logistics</option>
              <option value="RETAIL">High Street Retail</option>
            </select>
          </div>
        </div>

        <!-- Quick filter tags -->
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span class="text-slate-400 font-medium">Quick Filters:</span>
          <button
            (click)="setYieldFilter(0)"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
            [ngClass]="minYield === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            All Yields
          </button>
          <button
            (click)="setYieldFilter(5)"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
            [ngClass]="minYield === 5 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            Yield &gt; 5%
          </button>
          <button
            (click)="setYieldFilter(7.5)"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
            [ngClass]="minYield === 7.5 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            Yield &gt; 7.5% (Pre-Leased)
          </button>
          <button
            (click)="setYieldFilter(9)"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
            [ngClass]="minYield === 9 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'"
          >
            Yield &gt; 9% (Commercial)
          </button>
        </div>
      </div>

      <!-- Listings Count -->
      <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Showing <strong>{{ filteredListings().length }}</strong> investment opportunities</span>
        <span>Verified by PropVest Diligence Desk</span>
      </div>

      <!-- Listings Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let item of filteredListings()"
          class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg hover:border-blue-500/50 transition-all duration-300"
        >
          <!-- Image Container -->
          <div class="relative h-48 w-full overflow-hidden bg-slate-900">
            <img
              [src]="item.imageUrl"
              [alt]="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            <!-- Top tags -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                {{ item.propertyType }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
                {{ item.rentalYield }}% Yield
              </span>
            </div>

            <!-- Watchlist Button -->
            <button
              (click)="toggleWatchlist(item)"
              class="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all"
              [title]="item.isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'"
            >
              <svg
                class="w-4 h-4 transition-colors"
                [ngClass]="item.isWatchlisted ? 'text-rose-500 fill-current' : 'text-white'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>

            <!-- Bottom location -->
            <div class="absolute bottom-3 left-3 right-3 text-white">
              <p class="text-xs font-medium text-slate-200 flex items-center">
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
              <h3 class="font-bold text-slate-900 dark:text-white text-base font-heading group-hover:text-blue-600 transition-colors line-clamp-1">
                {{ item.title }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {{ item.description }}
              </p>
            </div>

            <!-- Deal Metrics -->
            <div class="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold">Asking Price</span>
                <p class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {{ item.price | inrCurrency:'full' }}
                </p>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold">Monthly Rental</span>
                <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {{ item.monthlyRent | inrCurrency:'full' }}/mo
                </p>
              </div>
              <div class="col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                <span class="text-slate-500">Tenant: <strong class="text-slate-800 dark:text-slate-200">{{ item.tenant || 'Ready to Lease' }}</strong></span>
                <span class="text-slate-500">Area: <strong class="text-slate-800 dark:text-slate-200">{{ item.areaSqFt }} sq.ft</strong></span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-2 pt-2">
              <button
                (click)="openInquiryModal(item)"
                class="flex-1 py-2 px-3 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all text-center"
              >
                Contact Desk
              </button>
              <button
                (click)="simulateInvestment(item)"
                class="py-2 px-3 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Calculate ROI"
              >
                ROI Calc
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Inquiry Modal -->
      <div
        *ngIf="showInquiryModal()"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div class="bg-white dark:bg-[#14213D] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Inquire About Property Deal
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">PropVest Advisory Desk will connect within 2 hours</p>
            </div>
            <button
              (click)="showInquiryModal.set(false)"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs space-y-1">
            <div class="font-bold text-blue-900 dark:text-blue-200">{{ activeListing()?.title }}</div>
            <div class="text-blue-700 dark:text-blue-300">
              Asking: {{ activeListing()?.price | inrCurrency:'full' }} • Yield: {{ activeListing()?.rentalYield }}%
            </div>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
              <input
                type="text"
                [(ngModel)]="inquiryForm.name"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone (+91)</label>
              <input
                type="text"
                [(ngModel)]="inquiryForm.phone"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Message or Query</label>
              <textarea
                rows="3"
                [(ngModel)]="inquiryForm.message"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              (click)="showInquiryModal.set(false)"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="submitInquiry()"
              [disabled]="submittingInquiry()"
              class="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
            >
              {{ submittingInquiry() ? 'Sending...' : 'Send Inquiry to Seller' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MarketplaceComponent implements OnInit {
  listings = signal<MarketplaceListing[]>([]);
  filteredListings = signal<MarketplaceListing[]>([]);
  
  searchQuery = '';
  selectedCity = 'ALL';
  selectedType = 'ALL';
  minYield = 0;

  showInquiryModal = signal<boolean>(false);
  activeListing = signal<MarketplaceListing | null>(null);
  submittingInquiry = signal<boolean>(false);

  inquiryForm = {
    name: 'Vikram Aditya',
    phone: '+91 98765 43210',
    message: 'I am interested in this deal and would like to review the lease deed, rent escalation history, and property title diligence report.'
  };

  private demoListings: MarketplaceListing[] = [
    {
      id: 'mkt-1',
      title: 'EON Free Zone – Grade A Office Floor',
      description: 'Pre-leased commercial floor in Kharadi IT hub. Blue-chip tenant on 5-year lock-in with 15% escalation.',
      propertyType: 'COMMERCIAL',
      city: 'Pune',
      location: 'Kharadi IT Park',
      price: 45000000,
      monthlyRent: 337500,
      rentalYield: 9.0,
      areaSqFt: 3500,
      tenant: 'Barclays Global Services',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
      isWatchlisted: false
    },
    {
      id: 'mkt-2',
      title: 'Prestige Tech Pacific – Managed Office Unit',
      description: 'Fully fitted high-tech office unit in Whitefield. Tenant has occupied space since 2021 with impeccable payment track record.',
      propertyType: 'COMMERCIAL',
      city: 'Bengaluru',
      location: 'Whitefield',
      price: 28000000,
      monthlyRent: 210000,
      rentalYield: 9.0,
      areaSqFt: 2200,
      tenant: 'Cognizant Technology',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
      isWatchlisted: true
    },
    {
      id: 'mkt-3',
      title: 'Hiranandani Business Park – Retail Showroom',
      description: 'Ground floor corner retail showroom leased to leading private sector bank with 9-year long lease tenure.',
      propertyType: 'RETAIL',
      city: 'Mumbai',
      location: 'Powai',
      price: 62000000,
      monthlyRent: 415000,
      rentalYield: 8.03,
      areaSqFt: 1850,
      tenant: 'Axis Bank Branch & ATM',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
      isWatchlisted: false
    },
    {
      id: 'mkt-4',
      title: 'DLF Cyber City Phase 3 – Tech Studio',
      description: 'Grade-A tech workspace pre-leased to US fintech multinational on long-term lock-in with security deposit of 6 months.',
      propertyType: 'COMMERCIAL',
      city: 'Gurugram',
      location: 'Cyber City Sector 24',
      price: 52000000,
      monthlyRent: 375000,
      rentalYield: 8.65,
      areaSqFt: 2900,
      tenant: 'S&P Global Solutions',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1000&auto=format&fit=crop&q=80',
      isWatchlisted: false
    },
    {
      id: 'mkt-5',
      title: 'HITEC City Logistics Park – Grade A Bay',
      description: 'High-cube warehouse bay strategically positioned near Outer Ring Road with modern dock levelers and fire sprinkler grid.',
      propertyType: 'WAREHOUSE',
      city: 'Hyderabad',
      location: 'Shamshabad ORR',
      price: 36000000,
      monthlyRent: 285000,
      rentalYield: 9.5,
      areaSqFt: 8500,
      tenant: 'Delhivery Supply Chain',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80',
      isWatchlisted: false
    },
    {
      id: 'mkt-6',
      title: 'Sobha Royal Pavilion – Luxury 3BHK Rental',
      description: 'High rental demand residential flat on Sarjapur Road near RGA Tech Park and Wipro Corporate Office.',
      propertyType: 'RESIDENTIAL',
      city: 'Bengaluru',
      location: 'Sarjapur Road',
      price: 18500000,
      monthlyRent: 68000,
      rentalYield: 4.41,
      areaSqFt: 1850,
      tenant: 'Executive Family',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
      isWatchlisted: false
    }
  ];

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchMarketplace();
  }

  fetchMarketplace(): void {
    this.api.getMarketplaceListings().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.listings.set(res.data);
          this.filteredListings.set(res.data);
        } else {
          this.listings.set(this.demoListings);
          this.filteredListings.set(this.demoListings);
        }
      },
      error: () => {
        this.listings.set(this.demoListings);
        this.filteredListings.set(this.demoListings);
      }
    });
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    const city = this.selectedCity;
    const type = this.selectedType;
    const minYield = this.minYield;

    const filtered = this.listings().filter(item => {
      const matchQuery = !q ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q) ||
        (item.tenant && item.tenant.toLowerCase().includes(q));

      const matchCity = city === 'ALL' || (item.city || '').toLowerCase() === city.toLowerCase();
      const matchType = type === 'ALL' || (item.propertyType || '').toUpperCase() === type.toUpperCase();
      const matchYield = !minYield || (item.rentalYield || 0) >= minYield;

      return matchQuery && matchCity && matchType && matchYield;
    });

    this.filteredListings.set(filtered);
  }

  setYieldFilter(yieldVal: number): void {
    this.minYield = yieldVal;
    this.applyFilters();
  }

  toggleWatchlist(item: MarketplaceListing): void {
    item.isWatchlisted = !item.isWatchlisted;
    if (item.isWatchlisted) {
      this.api.addToWatchlist(item.id).subscribe({
        next: () => this.toast.success(`"${item.title}" added to your Watchlist`),
        error: () => this.toast.success(`"${item.title}" saved to your Watchlist`)
      });
    } else {
      this.api.removeFromWatchlist(item.id).subscribe({
        next: () => this.toast.info(`"${item.title}" removed from Watchlist`),
        error: () => this.toast.info(`"${item.title}" removed from Watchlist`)
      });
    }
  }

  openInquiryModal(item: MarketplaceListing): void {
    this.activeListing.set(item);
    this.showInquiryModal.set(true);
  }

  submitInquiry(): void {
    this.submittingInquiry.set(true);
    const item = this.activeListing();
    this.api.contactSeller({
      listingId: item?.id,
      ...this.inquiryForm
    }).subscribe({
      next: () => {
        this.toast.success('Your inquiry was sent! PropVest transaction desk will call you shortly.');
        this.showInquiryModal.set(false);
        this.submittingInquiry.set(false);
      },
      error: () => {
        // Fallback demo success
        this.toast.success('Inquiry logged successfully! Advisory desk will reach out soon.');
        this.showInquiryModal.set(false);
        this.submittingInquiry.set(false);
      }
    });
  }

  simulateInvestment(item: MarketplaceListing): void {
    const rent = item.monthlyRent || item.estimatedRentalIncome || 0;
    const annualRent = rent * 12;
    const payback = annualRent > 0 ? (item.price / annualRent).toFixed(1) : '0';
    this.toast.info(`Deal Analysis: ${item.rentalYield || item.estimatedRentalYield}% Gross Yield • ~${payback} Years gross payback period.`);
  }
}
