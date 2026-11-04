import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Loan } from '../../core/models';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Loans & EMI Management
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track active mortgages, reducing-balance EMI schedules, interest rate exposure, and amortization schedules.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button
            (click)="showAddModal.set(true)"
            class="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Mortgage Facility
          </button>
        </div>
      </div>

      <!-- High-Level Loan Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Outstanding Debt</span>
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {{ totalOutstanding() | inrCurrency:'full' }}
          </div>
          <span class="text-xs text-slate-500">From ₹2.95 Cr original sanction</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly EMI Outflow</span>
          <div class="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {{ totalEmi() | inrCurrency:'full' }}
          </div>
          <span class="text-xs text-slate-500">Covered 2.3x by rental income</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Blended Interest Rate</span>
          <div class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            8.65%
          </div>
          <span class="text-xs text-slate-500">Repo-linked floating benchmark</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Next EMI Debit Date</span>
          <div class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            05 Dec 2024
          </div>
          <span class="text-xs text-slate-500">Auto-debit via NACH active</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Active Mortgages List (2 Cols) -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading mb-4">
              Active Property Mortgages & Loans
            </h3>

            <div class="space-y-4">
              <div
                *ngFor="let loan of loans()"
                class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
              >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span class="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                      {{ loan.bankName }} • A/C #{{ loan.accountNumber }}
                    </span>
                    <h4 class="text-sm font-bold text-slate-900 dark:text-white">
                      {{ loan.propertyTitle }}
                    </h4>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-bold text-slate-900 dark:text-white">
                      {{ loan.monthlyEmi | inrCurrency:'full' }}/mo
                    </span>
                    <span class="block text-[10px] text-slate-400">@ {{ loan.interestRate }}% p.a.</span>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="space-y-1">
                  <div class="flex justify-between text-[11px] text-slate-500">
                    <span>Principal Repaid: {{ ((loan.originalAmount || loan.principalAmount || 0) - loan.outstandingBalance) | inrCurrency:'compact' }}</span>
                    <span>Outstanding: {{ loan.outstandingBalance | inrCurrency:'compact' }}</span>
                  </div>
                  <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      class="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      [style.width.%]="getProgress(loan)"
                    ></div>
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>Tenure: {{ loan.tenureMonths - (loan.paidMonths || 0) }} of {{ loan.tenureMonths }} mos left</span>
                  <button
                    (click)="recordEmi(loan)"
                    class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Pay Extra EMI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive EMI Calculator Card -->
        <div class="bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
            Live EMI Simulator
          </h3>
          <p class="text-xs text-slate-400">Test loan amounts and see monthly commitments immediately.</p>

          <div class="space-y-4 text-xs">
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-slate-600 dark:text-slate-300 font-semibold">Loan Amount</span>
                <span class="font-bold text-blue-600">{{ calcPrincipal | inrCurrency:'full' }}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="50000000"
                step="500000"
                [(ngModel)]="calcPrincipal"
                (ngModelChange)="recalc()"
                class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-slate-600 dark:text-slate-300 font-semibold">Interest Rate (% p.a.)</span>
                <span class="font-bold text-blue-600">{{ calcRate }}%</span>
              </div>
              <input
                type="range"
                min="6.5"
                max="14.0"
                step="0.1"
                [(ngModel)]="calcRate"
                (ngModelChange)="recalc()"
                class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-slate-600 dark:text-slate-300 font-semibold">Tenure</span>
                <span class="font-bold text-blue-600">{{ calcTenureYears }} Years ({{ calcTenureYears * 12 }} mos)</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                [(ngModel)]="calcTenureYears"
                (ngModelChange)="recalc()"
                class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2 mt-4">
              <div class="flex justify-between items-center">
                <span class="text-xs text-blue-900 dark:text-blue-300 font-medium">Monthly EMI</span>
                <span class="text-lg font-extrabold text-blue-700 dark:text-blue-400">{{ calculatedEmi() | inrCurrency:'full' }}</span>
              </div>
              <div class="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                <span>Total Interest:</span>
                <span>{{ calculatedInterest() | inrCurrency:'compact' }}</span>
              </div>
              <div class="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                <span>Total Payment:</span>
                <span>{{ (calcPrincipal + calculatedInterest()) | inrCurrency:'compact' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Loan Modal -->
      <div
        *ngIf="showAddModal()"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div class="bg-white dark:bg-[#14213D] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Add Mortgage Facility
            </h3>
            <button (click)="showAddModal.set(false)" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (ngSubmit)="submitLoan()" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Financing Bank</label>
              <input
                type="text"
                [(ngModel)]="loanForm.bankName"
                name="bankName"
                placeholder="e.g. HDFC Bank Ltd"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Loan Account Number</label>
              <input
                type="text"
                [(ngModel)]="loanForm.accountNumber"
                name="accountNumber"
                placeholder="e.g. 64829104812"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sanctioned Principal (₹)</label>
              <input
                type="number"
                [(ngModel)]="loanForm.originalAmount"
                name="originalAmount"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.05"
                  [(ngModel)]="loanForm.interestRate"
                  name="interestRate"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tenure (Months)</label>
                <input
                  type="number"
                  [(ngModel)]="loanForm.tenureMonths"
                  name="tenureMonths"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                (click)="showAddModal.set(false)"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                Save Loan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoansComponent implements OnInit {
  loans = signal<Loan[]>([
    {
      id: 'loan-1',
      propertyId: 'demo-prop-1',
      propertyTitle: 'Sobha Dream Acres – Tower 14, Unit 804',
      bankName: 'HDFC Bank Home Loans',
      accountNumber: 'HL-BLR-840291',
      originalAmount: 6500000,
      outstandingBalance: 4820000,
      interestRate: 8.5,
      tenureMonths: 240,
      paidMonths: 44,
      monthlyEmi: 56430,
      startDate: new Date('2021-03-01'),
      status: 'ACTIVE',
      createdAt: new Date()
    },
    {
      id: 'loan-2',
      propertyId: 'demo-prop-2',
      propertyTitle: 'Hiranandani Estate – Rodas Enclave',
      bankName: 'State Bank of India (SBI MaxGain)',
      accountNumber: 'SBIMG-THN-99120',
      originalAmount: 12000000,
      outstandingBalance: 9850000,
      interestRate: 8.65,
      tenureMonths: 240,
      paidMonths: 48,
      monthlyEmi: 105200,
      startDate: new Date('2020-11-01'),
      status: 'ACTIVE',
      createdAt: new Date()
    }
  ]);

  totalOutstanding = signal<number>(14670000);
  totalEmi = signal<number>(161630);

  calcPrincipal = 5000000;
  calcRate = 8.5;
  calcTenureYears = 20;
  calculatedEmi = signal<number>(43391);
  calculatedInterest = signal<number>(5413840);

  showAddModal = signal<boolean>(false);
  loanForm = {
    bankName: 'ICICI Bank Home Finance',
    accountNumber: 'ICICI-HL-77123',
    originalAmount: 5000000,
    interestRate: 8.75,
    tenureMonths: 240
  };

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.recalc();
    this.api.getLoans().subscribe({
      next: (res) => {
        if (res.data?.loans?.length > 0) {
          this.loans.set(res.data.loans);
        }
      },
      error: () => {}
    });
  }

  recalc(): void {
    const P = this.calcPrincipal;
    const r = this.calcRate / (12 * 100);
    const n = this.calcTenureYears * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emi * n;
    this.calculatedEmi.set(Math.round(emi));
    this.calculatedInterest.set(Math.round(totalPay - P));
  }

  getProgress(loan: Loan): number {
    const orig = loan.originalAmount || loan.principalAmount || 0;
    if (!orig) return 0;
    const paid = orig - loan.outstandingBalance;
    return Math.round((paid / orig) * 100);
  }

  recordEmi(loan: Loan): void {
    const emi = loan.monthlyEmi || loan.emiAmount || 0;
    this.toast.success(`Extra payment of ₹${emi.toLocaleString('en-IN')} logged for ${loan.bankName}. Outstanding reduced!`);
    loan.outstandingBalance = Math.max(0, loan.outstandingBalance - emi);
  }

  submitLoan(): void {
    const r = this.loanForm.interestRate / (12 * 100);
    const n = this.loanForm.tenureMonths;
    const emi = Math.round((this.loanForm.originalAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    const newLoan: Loan = {
      id: 'loan-' + Date.now(),
      propertyId: 'demo-prop-3',
      propertyTitle: 'DLF Cybercity Tech Park',
      bankName: this.loanForm.bankName,
      accountNumber: this.loanForm.accountNumber,
      originalAmount: this.loanForm.originalAmount,
      outstandingBalance: this.loanForm.originalAmount,
      interestRate: this.loanForm.interestRate,
      tenureMonths: this.loanForm.tenureMonths,
      paidMonths: 0,
      monthlyEmi: emi,
      startDate: new Date(),
      status: 'ACTIVE',
      createdAt: new Date()
    };

    this.loans.update(prev => [newLoan, ...prev]);
    this.toast.success('Mortgage facility added to your portfolio.');
    this.showAddModal.set(false);
  }
}
