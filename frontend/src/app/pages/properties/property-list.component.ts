import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Property } from '../../core/models';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            My Properties
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your acquired real estate assets, monitor current valuations, and track yields.
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <a
            routerLink="/comparison"
            class="inline-flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Compare Assets
          </a>
          <a
            routerLink="/properties/add"
            class="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add New Property
          </a>
        </div>
      </div>

      <!-- Search & Filters Bar -->
      <div class="bg-white dark:bg-[#14213D] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <!-- Search Input -->
        <div class="relative flex-1">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="filterProperties()"
            placeholder="Search by property name, city, or address..."
            class="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <!-- Filter Dropdowns & View Toggle -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Type Filter -->
          <select
            [(ngModel)]="selectedType"
            (ngModelChange)="filterProperties()"
            class="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Types</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="COMMERCIAL_PLOT">Commercial Plot</option>
            <option value="INDUSTRIAL">Industrial</option>
          </select>

          <!-- Status Filter -->
          <select
            [(ngModel)]="selectedStatus"
            (ngModelChange)="filterProperties()"
            class="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="RENTED">Rented</option>
            <option value="OWNED">Self Occupied / Owned</option>
            <option value="VACANT">Vacant</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
          </select>

          <!-- Sort Dropdown -->
          <select
            [(ngModel)]="sortBy"
            (ngModelChange)="filterProperties()"
            class="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="DEFAULT">Sort: Default</option>
            <option value="VALUATION_DESC">Valuation: High to Low</option>
            <option value="VALUATION_ASC">Valuation: Low to High</option>
            <option value="YIELD_DESC">Rental Yield: High to Low</option>
          </select>

          <!-- View Mode Toggle (Grid vs Table) -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              (click)="viewMode.set('grid')"
              class="p-1.5 rounded-lg transition-colors"
              [ngClass]="viewMode() === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'"
              title="Grid View"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button
              (click)="viewMode.set('table')"
              class="p-1.5 rounded-lg transition-colors"
              [ngClass]="viewMode() === 'table' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'"
              title="Table View"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div *ngFor="let i of [1,2,3]" class="h-64 bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200 dark:border-slate-800"></div>
      </div>

      <!-- Zero State -->
      <div *ngIf="!loading() && filteredList().length === 0" class="text-center py-16 bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No matching properties found</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">Try clearing your search query or filters, or add a new property asset to your portfolio.</p>
        <button (click)="resetFilters()" class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300">
          Clear Filters
        </button>
      </div>

      <!-- GRID VIEW -->
      <div *ngIf="!loading() && filteredList().length > 0 && viewMode() === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let prop of filteredList()"
          class="bg-white dark:bg-[#14213D] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
        >
          <div>
            <!-- Image & Status Overlay -->
            <div class="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                [src]="prop.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Property"
              />
              <span
                class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm"
                [ngClass]="{
                  'bg-emerald-500 text-white': prop.status === 'RENTED',
                  'bg-blue-600 text-white': prop.status === 'OWNED',
                  'bg-amber-500 text-white': prop.status === 'VACANT',
                  'bg-slate-500 text-white': prop.status === 'UNDER_MAINTENANCE'
                }"
              >
                {{ prop.status }}
              </span>

              <div class="absolute top-3 right-3 flex space-x-1.5">
                <a
                  [routerLink]="['/properties/edit', prop.id]"
                  class="p-2 rounded-xl bg-black/50 hover:bg-black/80 text-white transition-colors"
                  title="Edit Property"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </a>
                <button
                  (click)="confirmDelete(prop)"
                  class="p-2 rounded-xl bg-black/50 hover:bg-rose-600 text-white transition-colors"
                  title="Delete Property"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 space-y-3">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {{ prop.type }}
                </span>
                <h3 class="text-base font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                  {{ prop.name || prop.title }}
                </h3>
                <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {{ prop.address }}, {{ prop.city }}
                </p>
              </div>

              <!-- Quick Specs -->
              <div class="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300 border-y border-slate-100 dark:border-slate-800 py-2.5">
                <span>{{ prop.area || prop.areaSqFt }} sq.ft</span>
                <span *ngIf="prop.bedrooms">· {{ prop.bedrooms }} BHK</span>
                <span *ngIf="prop.monthlyRentalIncome || prop.monthlyRent">· {{ (prop.monthlyRentalIncome || prop.monthlyRent || 0) | inrCurrency:'full' }}/mo</span>
              </div>

              <!-- Price & ROI Metrics -->
              <div class="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-semibold">Current Valuation</span>
                  <p class="text-sm font-extrabold text-slate-900 dark:text-white">{{ prop.currentValuation | inrCurrency:'compact' }}</p>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-slate-400 uppercase font-semibold">Purchase Price</span>
                  <p class="text-xs font-semibold text-slate-600 dark:text-slate-400">{{ prop.purchasePrice | inrCurrency:'compact' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Button -->
          <div class="px-5 pb-5 pt-2 flex items-center space-x-2">
            <a
              [routerLink]="['/properties', prop.id]"
              class="flex-1 inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 transition-colors"
            >
              View Dossier
            </a>
            <a
              [routerLink]="['/properties/edit', prop.id]"
              class="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
            >
              Edit
            </a>
          </div>
        </div>
      </div>

      <!-- TABLE VIEW -->
      <div *ngIf="!loading() && filteredList().length > 0 && viewMode() === 'table'" class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3.5 px-4">Property</th>
                <th class="py-3.5 px-4">Category</th>
                <th class="py-3.5 px-4">City</th>
                <th class="py-3.5 px-4">Purchase Price</th>
                <th class="py-3.5 px-4">Valuation</th>
                <th class="py-3.5 px-4">Monthly Rent</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let prop of filteredList()" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {{ prop.name || prop.title }}
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                    {{ prop.type }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-500">{{ prop.city }}</td>
                <td class="py-3 px-4">{{ prop.purchasePrice | inrCurrency:'compact' }}</td>
                <td class="py-3 px-4 font-bold text-emerald-600">{{ prop.currentValuation | inrCurrency:'compact' }}</td>
                <td class="py-3 px-4 text-blue-600 font-medium">
                  {{ (prop.monthlyRentalIncome || prop.monthlyRent || 0) | inrCurrency:'full' }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    [ngClass]="{
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300': prop.status === 'RENTED',
                      'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300': prop.status === 'OWNED',
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300': prop.status === 'VACANT'
                    }"
                  >
                    {{ prop.status }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center space-x-2">
                  <a
                    [routerLink]="['/properties', prop.id]"
                    class="text-blue-600 hover:underline font-semibold"
                  >
                    View
                  </a>
                  <a
                    [routerLink]="['/properties/edit', prop.id]"
                    class="text-slate-500 hover:underline"
                  >
                    Edit
                  </a>
                  <button
                    (click)="confirmDelete(prop)"
                    class="text-rose-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        *ngIf="propertyToDelete()"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div class="bg-white dark:bg-[#14213D] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
          <div class="flex items-center space-x-3 text-rose-600">
            <div class="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Delete Property Asset?</h3>
              <p class="text-xs text-slate-500">This action will remove all related transactions.</p>
            </div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300">
            Are you sure you want to remove <strong class="text-slate-900 dark:text-white">{{ propertyToDelete()?.name || propertyToDelete()?.title }}</strong> from your portfolio?
          </p>

          <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              (click)="propertyToDelete.set(null)"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="executeDelete()"
              class="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-500/20 transition-all"
            >
              Delete Property
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PropertyListComponent implements OnInit {
  properties = signal<Property[]>([]);
  filteredList = signal<Property[]>([]);
  loading = signal<boolean>(true);
  viewMode = signal<'grid' | 'table'>('grid');

  searchQuery: string = '';
  selectedType: string = 'ALL';
  selectedStatus: string = 'ALL';
  sortBy: string = 'DEFAULT';

  propertyToDelete = signal<Property | null>(null);

  constructor(
    private apiService: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.apiService.getProperties().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.properties.set(res.data);
          this.filteredList.set(res.data);
        }
      },
      error: () => {
        this.loading.set(false);
        // Fallback demo properties if db is offline
        const fallback = this.getFallbackProperties();
        this.properties.set(fallback);
        this.filteredList.set(fallback);
      },
    });
  }

  filterProperties(): void {
    let list = this.properties();

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((p) => (
        (p.name || p.title || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.address || '').toLowerCase().includes(q)
      ));
    }

    if (this.selectedType !== 'ALL') {
      list = list.filter((p) => p.type === this.selectedType);
    }

    if (this.selectedStatus !== 'ALL') {
      list = list.filter((p) => p.status === this.selectedStatus);
    }

    // Sort
    if (this.sortBy === 'VALUATION_DESC') {
      list = [...list].sort((a, b) => b.currentValuation - a.currentValuation);
    } else if (this.sortBy === 'VALUATION_ASC') {
      list = [...list].sort((a, b) => a.currentValuation - b.currentValuation);
    } else if (this.sortBy === 'YIELD_DESC') {
      list = [...list].sort((a, b) => {
        const yieldA = ((a.monthlyRentalIncome || a.monthlyRent || 0) * 12) / a.purchasePrice;
        const yieldB = ((b.monthlyRentalIncome || b.monthlyRent || 0) * 12) / b.purchasePrice;
        return yieldB - yieldA;
      });
    }

    this.filteredList.set(list);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedType = 'ALL';
    this.selectedStatus = 'ALL';
    this.sortBy = 'DEFAULT';
    this.filteredList.set(this.properties());
  }

  confirmDelete(prop: Property): void {
    this.propertyToDelete.set(prop);
  }

  executeDelete(): void {
    const prop = this.propertyToDelete();
    if (!prop) return;

    this.apiService.deleteProperty(prop.id).subscribe({
      next: () => {
        this.properties.update(prev => prev.filter(p => p.id !== prop.id));
        this.filterProperties();
        this.toast.success('Property Deleted', `${prop.name || prop.title} was removed.`);
        this.propertyToDelete.set(null);
      },
      error: () => {
        // Fallback local removal
        this.properties.update(prev => prev.filter(p => p.id !== prop.id));
        this.filterProperties();
        this.toast.info('Property Removed', `${prop.name || prop.title} was removed from view.`);
        this.propertyToDelete.set(null);
      }
    });
  }

  private getFallbackProperties(): Property[] {
    return [
      {
        id: 'demo-prop-1',
        userId: 'u1',
        name: 'Sobha Dream Acres – Tower 14, Unit 804',
        type: 'RESIDENTIAL',
        address: 'Panathur Main Road, Off Marathahalli-ORR',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560087',
        purchasePrice: 9200000,
        currentValuation: 12800000,
        area: 1205,
        areaUnit: 'SQFT',
        bedrooms: 2,
        bathrooms: 2,
        purchaseDate: '2021-03-15',
        status: 'RENTED',
        monthlyRentalIncome: 42000,
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      },
      {
        id: 'demo-prop-2',
        userId: 'u1',
        name: 'Hiranandani Estate – Rodas Enclave',
        type: 'RESIDENTIAL',
        address: 'Ghodbunder Road, Thane West',
        city: 'Mumbai MMR',
        state: 'Maharashtra',
        pinCode: '400607',
        purchasePrice: 17500000,
        currentValuation: 23500000,
        area: 1450,
        areaUnit: 'SQFT',
        bedrooms: 3,
        bathrooms: 3,
        purchaseDate: '2019-11-20',
        status: 'RENTED',
        monthlyRentalIncome: 58000,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      },
      {
        id: 'demo-prop-3',
        userId: 'u1',
        name: 'DLF Cybercity Tech Park Office Bay 4B',
        type: 'COMMERCIAL',
        address: 'Sector 25A, Cyber City Phase 2',
        city: 'Gurugram',
        state: 'Haryana',
        pinCode: '122002',
        purchasePrice: 32000000,
        currentValuation: 41000000,
        area: 2400,
        areaUnit: 'SQFT',
        bedrooms: 0,
        bathrooms: 2,
        purchaseDate: '2020-08-10',
        status: 'RENTED',
        monthlyRentalIncome: 215000,
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      },
    ];
  }
}
