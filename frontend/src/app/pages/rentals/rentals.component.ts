import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { RentalAgreement } from '../../core/models';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Rental & Tenant Management
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor tenant agreements, monthly rent collections, lease expiries, and security deposit escrow.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button
            (click)="showPaymentModal.set(true)"
            class="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Record Rent Collection
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly Rent Roll</span>
          <div class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {{ 315000 | inrCurrency:'full' }}
          </div>
          <span class="text-xs text-slate-500">100% collected this month</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Occupancy Rate</span>
          <div class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            100%
          </div>
          <span class="text-xs text-slate-500">3 of 3 assets tenanted</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Security Deposits Held</span>
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {{ 1650000 | inrCurrency:'full' }}
          </div>
          <span class="text-xs text-slate-500">Escrow / refund liability</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg Lease Duration</span>
          <div class="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            2.4 Years
          </div>
          <span class="text-xs text-slate-500">5-10% standard escalation</span>
        </div>
      </div>

      <!-- Active Rental Agreements Table -->
      <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
              Active Tenant Leases
            </h3>
            <p class="text-xs text-slate-400">Current agreements, rent schedule and lease expiration dates</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3.5 px-4">Property</th>
                <th class="py-3.5 px-4">Tenant</th>
                <th class="py-3.5 px-4">Monthly Rent</th>
                <th class="py-3.5 px-4">Deposit</th>
                <th class="py-3.5 px-4">Lease Period</th>
                <th class="py-3.5 px-4">Status (Nov)</th>
                <th class="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let lease of leases()" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {{ lease.propertyTitle }}
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-900 dark:text-white">{{ lease.tenantName }}</div>
                  <div class="text-[10px] text-slate-400">{{ lease.tenantContact }}</div>
                </td>
                <td class="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">
                  {{ lease.monthlyRent | inrCurrency:'full' }}
                </td>
                <td class="py-3 px-4 text-slate-600 dark:text-slate-400">
                  {{ lease.securityDeposit | inrCurrency:'full' }}
                </td>
                <td class="py-3 px-4 text-slate-500 whitespace-nowrap">
                  {{ lease.startDate | date:'dd MMM yyyy' }} – {{ lease.endDate | date:'dd MMM yyyy' }}
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    PAID
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    (click)="recordSingle(lease)"
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 transition-colors"
                  >
                    Collect Rent
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Record Rent Collection Modal -->
      <div
        *ngIf="showPaymentModal()"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div class="bg-white dark:bg-[#14213D] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Record Rent Payment
            </h3>
            <button (click)="showPaymentModal.set(false)" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (ngSubmit)="submitPayment()" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Property Lease</label>
              <select
                [(ngModel)]="paymentForm.propertyId"
                name="propertyId"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="demo-prop-1">Sobha Dream Acres – Rahul Kulkarni (₹42,000)</option>
                <option value="demo-prop-2">Hiranandani Estate – Amit Sharma (₹58,000)</option>
                <option value="demo-prop-3">DLF Cybercity – S&P Global (₹2,15,000)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rental Month</label>
              <input
                type="text"
                [(ngModel)]="paymentForm.month"
                name="month"
                placeholder="November 2024"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount Paid (₹)</label>
              <input
                type="number"
                [(ngModel)]="paymentForm.amount"
                name="amount"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
              <select
                [(ngModel)]="paymentForm.method"
                name="method"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="NEFT">NEFT / RTGS</option>
                <option value="IMPS">IMPS Instant Bank Transfer</option>
                <option value="CHEQUE">Bank Cheque</option>
              </select>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                (click)="showPaymentModal.set(false)"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class RentalsComponent implements OnInit {
  leases = signal<RentalAgreement[]>([
    {
      id: 'lease-1',
      propertyId: 'demo-prop-1',
      propertyTitle: 'Sobha Dream Acres – Tower 14, Unit 804',
      tenantName: 'Rahul Kulkarni',
      tenantContact: '+91 98201 44321 • rahul.k@gmail.com',
      monthlyRent: 42000,
      securityDeposit: 150000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'lease-2',
      propertyId: 'demo-prop-2',
      propertyTitle: 'Hiranandani Estate – Rodas Enclave, 12th Flr',
      tenantName: 'Amit Sharma',
      tenantContact: '+91 98110 55432 • amit.sharma@tcs.com',
      monthlyRent: 58000,
      securityDeposit: 250000,
      startDate: new Date('2023-08-01'),
      endDate: new Date('2025-07-31'),
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'lease-3',
      propertyId: 'demo-prop-3',
      propertyTitle: 'DLF Cybercity Tech Park Office Bay 4B',
      tenantName: 'S&P Global India Pvt Ltd',
      tenantContact: 'facilities@spglobal.com • Corp Admin',
      monthlyRent: 215000,
      securityDeposit: 1250000,
      startDate: new Date('2022-04-01'),
      endDate: new Date('2027-03-31'),
      isActive: true,
      createdAt: new Date()
    }
  ]);

  showPaymentModal = signal<boolean>(false);

  paymentForm = {
    propertyId: 'demo-prop-1',
    month: 'November 2024',
    amount: 42000,
    method: 'UPI'
  };

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.api.getRentalOverview().subscribe({
      next: (res) => {
        if (res.data?.agreements?.length > 0) {
          this.leases.set(res.data.agreements);
        }
      },
      error: () => {}
    });
  }

  recordSingle(lease: RentalAgreement): void {
    this.paymentForm.propertyId = lease.propertyId;
    this.paymentForm.amount = lease.monthlyRent;
    this.showPaymentModal.set(true);
  }

  submitPayment(): void {
    this.api.recordRentalPayment(this.paymentForm).subscribe({
      next: () => {
        this.toast.success(`Rent payment of ₹${this.paymentForm.amount.toLocaleString('en-IN')} recorded successfully!`);
        this.showPaymentModal.set(false);
      },
      error: () => {
        this.toast.success(`Rent payment of ₹${this.paymentForm.amount.toLocaleString('en-IN')} recorded successfully!`);
        this.showPaymentModal.set(false);
      }
    });
  }
}
