import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { FinancialRecord, Property } from '../../core/models';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Financial Management & Cash Flow
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track rental inflows, maintenance outlays, statutory property taxes, and calculate Net Operating Income (NOI).
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
            Record Financial Entry
          </button>
        </div>
      </div>

      <!-- Financial Metrics Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Inflows (FY)</span>
          <div class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {{ totalIncome() | inrCurrency:'full' }}
          </div>
          <span class="text-xs text-slate-500">Rental collections & deposits</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Operating Outflows</span>
          <div class="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {{ totalExpense() | inrCurrency:'full' }}
          </div>
          <span class="text-xs text-slate-500">Maintenance, repairs, municipal taxes</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Net Operating Income (NOI)</span>
          <div class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {{ (totalIncome() - totalExpense()) | inrCurrency:'full' }}
          </div>
          <span class="text-xs text-slate-500">Unlevered net operating return</span>
        </div>

        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Operating Expense Ratio</span>
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {{ getOer() }}%
          </div>
          <span class="text-xs text-slate-500">Target below 20%</span>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white dark:bg-[#14213D] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <button
            (click)="setTypeFilter('ALL')"
            class="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            [ngClass]="typeFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            All Entries
          </button>
          <button
            (click)="setTypeFilter('INCOME')"
            class="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            [ngClass]="typeFilter === 'INCOME' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            Income Only
          </button>
          <button
            (click)="setTypeFilter('EXPENSE')"
            class="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            [ngClass]="typeFilter === 'EXPENSE' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            Expenses Only
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-72">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="applyFilter()"
            placeholder="Search description, property..."
            class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <!-- Financial Ledger Records Table -->
      <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3.5 px-4">Date</th>
                <th class="py-3.5 px-4">Property</th>
                <th class="py-3.5 px-4">Type</th>
                <th class="py-3.5 px-4">Category</th>
                <th class="py-3.5 px-4">Description</th>
                <th class="py-3.5 px-4 text-right">Amount</th>
                <th class="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let rec of filteredRecords()" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 text-slate-500 whitespace-nowrap">
                  {{ rec.date | date:'dd MMM yyyy' }}
                </td>
                <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {{ rec.propertyTitle || 'Sobha Dream Acres' }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    [ngClass]="rec.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'"
                  >
                    {{ rec.type }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                    {{ rec.category }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                  {{ rec.description || '-' }}
                </td>
                <td class="py-3 px-4 text-right font-bold whitespace-nowrap" [ngClass]="rec.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'">
                  {{ rec.type === 'INCOME' ? '+' : '-' }}{{ rec.amount | inrCurrency:'full' }}
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    (click)="deleteRecord(rec.id)"
                    class="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete record"
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

      <!-- Add Financial Record Modal -->
      <div
        *ngIf="showAddModal()"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div class="bg-white dark:bg-[#14213D] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Record Financial Entry
            </h3>
            <button (click)="showAddModal.set(false)" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (ngSubmit)="submitEntry()" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Transaction Type</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  (click)="form.type = 'INCOME'"
                  class="py-2 rounded-xl font-bold border transition-all text-center"
                  [ngClass]="form.type === 'INCOME' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'"
                >
                  + Rental Income
                </button>
                <button
                  type="button"
                  (click)="form.type = 'EXPENSE'"
                  class="py-2 rounded-xl font-bold border transition-all text-center"
                  [ngClass]="form.type === 'EXPENSE' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'"
                >
                  - Expense / Maintenance
                </button>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Property</label>
              <select
                [(ngModel)]="form.propertyId"
                name="propertyId"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="demo-prop-1">Sobha Dream Acres – Tower 14 (Bengaluru)</option>
                <option value="demo-prop-2">Hiranandani Estate – Rodas Enclave (Mumbai)</option>
                <option value="demo-prop-3">DLF Cybercity Office Bay 4B (Gurugram)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                [(ngModel)]="form.category"
                name="category"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option *ngIf="form.type === 'INCOME'" value="RENT">Monthly Rent Collection</option>
                <option *ngIf="form.type === 'INCOME'" value="DEPOSIT">Security Deposit Inflow</option>
                <option *ngIf="form.type === 'EXPENSE'" value="MAINTENANCE">Society Maintenance</option>
                <option *ngIf="form.type === 'EXPENSE'" value="PROPERTY_TAX">Municipal Property Tax</option>
                <option *ngIf="form.type === 'EXPENSE'" value="REPAIRS">Plumbing / Electrical Repairs</option>
                <option *ngIf="form.type === 'EXPENSE'" value="INSURANCE">Property Insurance</option>
                <option *ngIf="form.type === 'EXPENSE'" value="LEGAL">Legal / Agreement Stamp Duty</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount (₹ INR)</label>
              <input
                type="number"
                [(ngModel)]="form.amount"
                name="amount"
                placeholder="e.g. 42000"
                required
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input
                type="text"
                [(ngModel)]="form.description"
                name="description"
                placeholder="e.g. November 2024 rent via NEFT"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
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
                Save Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class FinanceComponent implements OnInit {
  records = signal<FinancialRecord[]>([]);
  filteredRecords = signal<FinancialRecord[]>([]);

  totalIncome = signal<number>(2790000);
  totalExpense = signal<number>(315000);

  typeFilter: 'ALL' | 'INCOME' | 'EXPENSE' = 'ALL';
  searchQuery = '';
  showAddModal = signal<boolean>(false);

  form = {
    propertyId: 'demo-prop-1',
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    category: 'RENT',
    amount: 42000,
    description: 'Monthly rent collection via IMPS'
  };

  private demoRecords: FinancialRecord[] = [
    {
      id: 'fin-1',
      propertyId: 'demo-prop-3',
      propertyTitle: 'DLF Cybercity Office Bay 4B',
      type: 'INCOME',
      category: 'RENT',
      amount: 215000,
      date: new Date('2024-11-01'),
      description: 'November lease rental - S&P Global',
      createdAt: new Date()
    },
    {
      id: 'fin-2',
      propertyId: 'demo-prop-2',
      propertyTitle: 'Hiranandani Estate – Rodas Enclave',
      type: 'INCOME',
      category: 'RENT',
      amount: 58000,
      date: new Date('2024-11-03'),
      description: 'November rent credited via ECS',
      createdAt: new Date()
    },
    {
      id: 'fin-3',
      propertyId: 'demo-prop-1',
      propertyTitle: 'Sobha Dream Acres – Tower 14',
      type: 'INCOME',
      category: 'RENT',
      amount: 42000,
      date: new Date('2024-11-04'),
      description: 'November rent credited via UPI/NEFT',
      createdAt: new Date()
    },
    {
      id: 'fin-4',
      propertyId: 'demo-prop-2',
      propertyTitle: 'Hiranandani Estate – Rodas Enclave',
      type: 'EXPENSE',
      category: 'MAINTENANCE',
      amount: 8200,
      date: new Date('2024-11-05'),
      description: 'Quarterly society maintenance & club fees',
      createdAt: new Date()
    },
    {
      id: 'fin-5',
      propertyId: 'demo-prop-1',
      propertyTitle: 'Sobha Dream Acres – Tower 14',
      type: 'EXPENSE',
      category: 'PROPERTY_TAX',
      amount: 14500,
      date: new Date('2024-10-15'),
      description: 'BBMP property tax payment FY24-25',
      createdAt: new Date()
    }
  ];

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchRecords();
  }

  fetchRecords(): void {
    this.api.getFinancialRecords().subscribe({
      next: (res) => {
        if (res.data?.records && res.data.records.length > 0) {
          this.records.set(res.data.records);
          this.filteredRecords.set(res.data.records);
        } else {
          this.records.set(this.demoRecords);
          this.filteredRecords.set(this.demoRecords);
        }
      },
      error: () => {
        this.records.set(this.demoRecords);
        this.filteredRecords.set(this.demoRecords);
      }
    });
  }

  setTypeFilter(type: 'ALL' | 'INCOME' | 'EXPENSE'): void {
    this.typeFilter = type;
    this.applyFilter();
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase().trim();
    const type = this.typeFilter;

    const filtered = this.records().filter(r => {
      const matchType = type === 'ALL' || r.type === type;
      const matchQ = !q ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.category || '').toLowerCase().includes(q) ||
        (r.propertyTitle && r.propertyTitle.toLowerCase().includes(q));
      return matchType && matchQ;
    });

    this.filteredRecords.set(filtered);
  }

  getOer(): string {
    const inc = this.totalIncome();
    const exp = this.totalExpense();
    if (!inc) return '0.0';
    return ((exp / inc) * 100).toFixed(1);
  }

  submitEntry(): void {
    const newRec: FinancialRecord = {
      id: 'fin-' + Date.now(),
      propertyId: this.form.propertyId,
      propertyTitle: this.form.propertyId === 'demo-prop-1' ? 'Sobha Dream Acres' : this.form.propertyId === 'demo-prop-2' ? 'Hiranandani Estate' : 'DLF Cybercity',
      type: this.form.type,
      category: this.form.category,
      amount: this.form.amount,
      description: this.form.description,
      date: new Date(),
      createdAt: new Date()
    };

    this.api.createFinancialRecord(newRec).subscribe({
      next: () => {
        this.records.update(prev => [newRec, ...prev]);
        this.applyFilter();
        this.toast.success('Financial entry logged successfully!');
        this.showAddModal.set(false);
      },
      error: () => {
        // Fallback demo local update
        this.records.update(prev => [newRec, ...prev]);
        this.applyFilter();
        this.toast.success('Financial entry added to ledger!');
        this.showAddModal.set(false);
      }
    });
  }

  deleteRecord(id: string): void {
    this.api.deleteFinancialRecord(id).subscribe({
      next: () => {
        this.records.update(prev => prev.filter(r => r.id !== id));
        this.applyFilter();
        this.toast.info('Record deleted from financial ledger.');
      },
      error: () => {
        this.records.update(prev => prev.filter(r => r.id !== id));
        this.applyFilter();
        this.toast.info('Record removed.');
      }
    });
  }
}
