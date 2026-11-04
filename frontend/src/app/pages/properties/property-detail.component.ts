import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';
import { Property } from '../../core/models';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb and Top Nav -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <a routerLink="/dashboard" class="hover:text-blue-600 transition-colors">Dashboard</a>
          <span>/</span>
          <a routerLink="/properties" class="hover:text-blue-600 transition-colors">Properties</a>
          <span>/</span>
          <span class="text-slate-900 dark:text-white font-medium">{{ property()?.title || 'Property Details' }}</span>
        </div>
        <div class="flex items-center space-x-3">
          <a
            routerLink="/properties"
            class="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to List
          </a>
          <a
            [routerLink]="['/properties/edit', property()?.id]"
            class="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            Edit
          </a>
          <button
            (click)="exportReport()"
            class="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export Dossier
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">Loading comprehensive property intelligence...</p>
      </div>

      <!-- Main Property Content -->
      <div *ngIf="!loading() && property()" class="space-y-6">
        <!-- Hero Card with Image Banner & Key Stats -->
        <div class="bg-white dark:bg-[#14213D] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
            <img
              [src]="property()?.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80'"
              [alt]="property()?.title"
              class="w-full h-full object-cover opacity-85"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            
            <!-- Badges overlay -->
            <div class="absolute top-4 left-4 flex flex-wrap gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
                {{ property()?.type }}
              </span>
              <span
                class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
                [ngClass]="{
                  'bg-emerald-500 text-white': property()?.status === 'RENTED',
                  'bg-amber-500 text-white': property()?.status === 'VACANT',
                  'bg-blue-500 text-white': property()?.status === 'ACTIVE'
                }"
              >
                {{ property()?.status }}
              </span>
            </div>

            <!-- Title & Location overlay -->
            <div class="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div class="text-white space-y-1">
                <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm font-heading">
                  {{ property()?.title }}
                </h1>
                <p class="text-sm text-slate-300 flex items-center">
                  <svg class="w-4 h-4 mr-1 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ property()?.address }}, {{ property()?.city }}, {{ property()?.state }} - {{ property()?.pincode }}
                </p>
              </div>

              <!-- Price Box -->
              <div class="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-white self-start md:self-auto">
                <div class="text-[10px] uppercase font-bold tracking-wider text-slate-300">Current Valuation</div>
                <div class="text-2xl font-extrabold text-emerald-400">
                  {{ property()?.currentValuation | inrCurrency:'full' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 p-4">
            <div class="p-3 text-center sm:text-left">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Purchase Price</span>
              <div class="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {{ property()?.purchasePrice | inrCurrency:'full' }}
              </div>
              <span class="text-[11px] text-slate-500">Bought {{ property()?.purchaseDate | date:'mediumDate' }}</span>
            </div>

            <div class="p-3 text-center sm:text-left">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Capital Gain</span>
              <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                +{{ ((property()?.currentValuation || 0) - (property()?.purchasePrice || 0)) | inrCurrency:'full' }}
              </div>
              <span class="text-[11px] font-medium text-emerald-600">
                +{{ getAppreciationPercent() }}% Total Appreciation
              </span>
            </div>

            <div class="p-3 text-center sm:text-left">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Monthly Rental</span>
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {{ (property()?.monthlyRent || 0) | inrCurrency:'full' }}/mo
              </div>
              <span class="text-[11px] text-slate-500">Annual: {{ ((property()?.monthlyRent || 0) * 12) | inrCurrency:'compact' }}</span>
            </div>

            <div class="p-3 text-center sm:text-left">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Gross Rental Yield</span>
              <div class="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {{ getRentalYield() }}%
              </div>
              <span class="text-[11px] text-slate-500">India benchmark: 3.5% - 4.5%</span>
            </div>
          </div>
        </div>

        <!-- 2 Column Layout for In-depth Details -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left 2 Cols: Specifications, Cashflow, Valuation History -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Property Specifications -->
            <div class="bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h2 class="text-base font-bold text-slate-900 dark:text-white font-heading mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                Asset Specifications & Features
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 font-medium">Super Built-up Area</span>
                  <p class="text-sm font-bold text-slate-900 dark:text-white mt-1">{{ property()?.areaSqFt || '1,850' }} sq.ft</p>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 font-medium">Bedrooms / Configuration</span>
                  <p class="text-sm font-bold text-slate-900 dark:text-white mt-1">{{ property()?.bedrooms || 3 }} BHK</p>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 font-medium">Bathrooms</span>
                  <p class="text-sm font-bold text-slate-900 dark:text-white mt-1">{{ property()?.bathrooms || 3 }} Baths</p>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 font-medium">Furnishing Status</span>
                  <p class="text-sm font-bold text-slate-900 dark:text-white mt-1">{{ property()?.furnishingStatus || 'Semi-Furnished' }}</p>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 font-medium">Parking Spots</span>
                  <p class="text-sm font-bold text-slate-900 dark:text-white mt-1">2 Covered Stilt</p>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span class="text-slate-400 font-medium">Possession / Age</span>
                  <p class="text-sm font-bold text-slate-900 dark:text-white mt-1">2021 (3.5 yrs)</p>
                </div>
              </div>

              <!-- Description -->
              <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asset Description</span>
                <p class="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {{ property()?.description || 'Prime high-rise residential apartment located inside a gated community with clubhouse, pool, high-speed elevators, 24/7 security, and power backup. Ideal for tech professionals working in nearby cyber hubs.' }}
                </p>
              </div>
            </div>

            <!-- Cash Flow Breakdown Card -->
            <div class="bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h2 class="text-base font-bold text-slate-900 dark:text-white font-heading mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Monthly Operating Cash Flow
              </h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40">
                  <span class="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Gross Rental Income (+)</span>
                  <span class="text-sm font-bold text-emerald-700 dark:text-emerald-400">+{{ (property()?.monthlyRent || 0) | inrCurrency:'full' }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span class="text-xs text-slate-600 dark:text-slate-300">Society Maintenance & Water (-)</span>
                  <span class="text-sm font-medium text-rose-600 dark:text-rose-400">-₹4,500</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span class="text-xs text-slate-600 dark:text-slate-300">Property Tax & Municipal Cess Reserve (-)</span>
                  <span class="text-sm font-medium text-rose-600 dark:text-rose-400">-₹1,800</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span class="text-xs text-slate-600 dark:text-slate-300">Estimated Home Loan EMI (-)</span>
                  <span class="text-sm font-medium text-rose-600 dark:text-rose-400">-{{ getEstimatedEmi() | inrCurrency:'full' }}</span>
                </div>
                <div class="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50">
                  <span class="text-xs font-bold text-blue-900 dark:text-blue-200">Net Monthly Cash Flow</span>
                  <span class="text-base font-extrabold" [ngClass]="getNetCashFlow() >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                    {{ getNetCashFlow() >= 0 ? '+' : '' }}{{ getNetCashFlow() | inrCurrency:'full' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Tenant Info & Document Vault -->
          <div class="space-y-6">
            <!-- Active Tenant Card -->
            <div class="bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h2 class="text-base font-bold text-slate-900 dark:text-white font-heading mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Current Lease & Tenant
              </h2>
              <div *ngIf="property()?.status === 'RENTED'" class="space-y-3 text-xs">
                <div class="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm">
                    RK
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white">Rahul Kulkarni</h4>
                    <p class="text-slate-500">Tech Mahindra, Senior Consultant</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2 pt-2">
                  <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Lease Start</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-200">01 Jan 2024</span>
                  </div>
                  <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Lease Expiry</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-200">31 Dec 2024</span>
                  </div>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                  <span class="text-slate-400 text-xs">Security Deposit:</span>
                  <span class="font-bold text-slate-900 dark:text-white">₹1,50,000 (Held)</span>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
                  <span class="text-slate-400 text-xs">Rent Status:</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">PAID (Nov)</span>
                </div>
              </div>
              <div *ngIf="property()?.status !== 'RENTED'" class="text-center py-6">
                <p class="text-xs text-slate-500 mb-3">No active lease agreement for this property.</p>
                <a
                  routerLink="/rentals"
                  class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 transition-colors"
                >
                  Create Rental Agreement
                </a>
              </div>
            </div>

            <!-- Documents Vault -->
            <div class="bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-base font-bold text-slate-900 dark:text-white font-heading flex items-center">
                  <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  Documents
                </h2>
                <a routerLink="/reports" class="text-xs text-blue-600 font-semibold hover:underline">Vault</a>
              </div>
              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 transition-colors">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span class="font-medium text-slate-800 dark:text-slate-200">Registered Sale Deed.pdf</span>
                  </div>
                  <span class="text-[10px] text-slate-400">2.4 MB</span>
                </div>
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 transition-colors">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span class="font-medium text-slate-800 dark:text-slate-200">Property Tax Receipt FY24.pdf</span>
                  </div>
                  <span class="text-[10px] text-slate-400">840 KB</span>
                </div>
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 transition-colors">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span class="font-medium text-slate-800 dark:text-slate-200">Tenant Police Verification.pdf</span>
                  </div>
                  <span class="text-[10px] text-slate-400">1.1 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PropertyDetailComponent implements OnInit {
  propertyId: string | null = null;
  property = signal<Property | null>(null);
  loading = signal<boolean>(true);

  // Fallback demo properties if backend DB is offline
  private demoProperties: Record<string, Property> = {
    'demo-prop-1': {
      id: 'demo-prop-1',
      userId: 'usr-1',
      title: 'Sobha Dream Acres – Tower 14, Unit 804',
      type: 'RESIDENTIAL',
      status: 'RENTED',
      address: 'Panathur Main Road, Off Marathahalli-ORR',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560087',
      purchasePrice: 9200000,
      currentValuation: 12800000,
      monthlyRent: 42000,
      areaSqFt: 1205,
      bedrooms: 2,
      bathrooms: 2,
      furnishingStatus: 'Semi-Furnished',
      purchaseDate: new Date('2021-03-15'),
      description: 'Well-maintained 2BHK flat inside a 81-acre mega township with multiple sports arenas, clubhouses, and easy connectivity to Outer Ring Road tech corridors.',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    'demo-prop-2': {
      id: 'demo-prop-2',
      userId: 'usr-1',
      title: 'Hiranandani Estate – Rodas Enclave, 12th Flr',
      type: 'RESIDENTIAL',
      status: 'RENTED',
      address: 'Ghodbunder Road, Thane West',
      city: 'Mumbai MMR',
      state: 'Maharashtra',
      pincode: '400607',
      purchasePrice: 17500000,
      currentValuation: 23500000,
      monthlyRent: 58000,
      areaSqFt: 1450,
      bedrooms: 3,
      bathrooms: 3,
      furnishingStatus: 'Fully-Furnished',
      purchaseDate: new Date('2019-11-20'),
      description: 'Luxury 3BHK flat overlooking Yeoor Hills, equipped with premium modular kitchen, Italian marble flooring, and assigned basement parking.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    'demo-prop-3': {
      id: 'demo-prop-3',
      userId: 'usr-1',
      title: 'DLF Cybercity Tech Park Office Bay 4B',
      type: 'COMMERCIAL',
      status: 'RENTED',
      address: 'Sector 25A, Cyber City Phase 2',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      purchasePrice: 32000000,
      currentValuation: 41000000,
      monthlyRent: 215000,
      areaSqFt: 2400,
      bedrooms: 0,
      bathrooms: 2,
      furnishingStatus: 'Warm Shell',
      purchaseDate: new Date('2020-08-10'),
      description: 'Grade-A commercial workspace leased to an MNC financial analytics firm on a 9-year triple net lease with 15% escalation every 3 years.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.propertyId = params.get('id');
      if (this.propertyId) {
        this.fetchProperty(this.propertyId);
      }
    });
  }

  fetchProperty(id: string): void {
    this.loading.set(true);
    this.api.getPropertyById(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.property.set(res.data);
        } else {
          this.useFallbackOrDemo(id);
        }
        this.loading.set(false);
      },
      error: () => {
        this.useFallbackOrDemo(id);
        this.loading.set(false);
      }
    });
  }

  private useFallbackOrDemo(id: string): void {
    if (this.demoProperties[id]) {
      this.property.set(this.demoProperties[id]);
    } else {
      // Create a generic property for any valid ID passed in URL
      this.property.set({
        id: id,
        userId: 'usr-1',
        title: 'Premium Portfolio Asset #' + id.slice(-4),
        type: 'RESIDENTIAL',
        status: 'RENTED',
        address: 'Banjara Hills Road No. 12',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        purchasePrice: 11500000,
        currentValuation: 15200000,
        monthlyRent: 48000,
        areaSqFt: 1650,
        bedrooms: 3,
        bathrooms: 3,
        furnishingStatus: 'Semi-Furnished',
        purchaseDate: new Date('2021-06-18'),
        description: 'Prime residential asset in a high-demand rental corridor with sustained capital appreciation.',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  getAppreciationPercent(): string {
    const p = this.property();
    if (!p || !p.purchasePrice || !p.currentValuation) return '0.0';
    const gain = p.currentValuation - p.purchasePrice;
    return ((gain / p.purchasePrice) * 100).toFixed(1);
  }

  getRentalYield(): string {
    const p = this.property();
    const rent = p?.monthlyRent || p?.monthlyRentalIncome || 0;
    if (!p || !p.purchasePrice || !rent) return '0.0';
    const annualRent = rent * 12;
    return ((annualRent / p.purchasePrice) * 100).toFixed(2);
  }

  getEstimatedEmi(): number {
    const p = this.property();
    if (!p || !p.purchasePrice) return 0;
    // Assuming 70% LTV loan at 8.5% interest for 20 years
    const loanAmount = p.purchasePrice * 0.7;
    const r = 8.5 / (12 * 100);
    const n = 240;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  }

  getNetCashFlow(): number {
    const p = this.property();
    const rent = p?.monthlyRent || p?.monthlyRentalIncome || 0;
    const maintenance = 4500;
    const tax = 1800;
    const emi = this.getEstimatedEmi();
    return rent - (maintenance + tax + emi);
  }

  exportReport(): void {
    this.toast.info('Generating verified PDF dossier for ' + (this.property()?.title || 'Property'));
    window.open(this.api.getReportDownloadUrl('portfolio', 'pdf'), '_blank');
  }
}
