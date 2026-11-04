import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Transaction } from '../../core/models';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Transactions & Audit Trail
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable, consolidated audit ledger of all bank debits, rental credits, EMI disbursements, and maintenance expenses.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button
            (click)="exportCsv()"
            class="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
          >
            <svg class="w-4 h-4 mr-1.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white dark:bg-[#14213D] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <button
            (click)="setFilter('ALL')"
            class="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            [ngClass]="activeFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            All Ledger Records
          </button>
          <button
            (click)="setFilter('INCOME')"
            class="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            [ngClass]="activeFilter === 'INCOME' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            Credits Only
          </button>
          <button
            (click)="setFilter('EXPENSE')"
            class="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            [ngClass]="activeFilter === 'EXPENSE' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            Debits Only
          </button>
        </div>

        <div class="relative w-full md:w-72">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="applyFilter()"
            placeholder="Search ref #, description, property..."
            class="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <!-- Transactions Ledger Table -->
      <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3.5 px-4">Date & Time</th>
                <th class="py-3.5 px-4">Ref Number</th>
                <th class="py-3.5 px-4">Property</th>
                <th class="py-3.5 px-4">Category</th>
                <th class="py-3.5 px-4">Payment Method</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let tx of filteredTransactions()" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-3 px-4 text-slate-500 whitespace-nowrap">
                  {{ tx.date | date:'dd MMM yyyy, HH:mm' }}
                </td>
                <td class="py-3 px-4 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                  {{ tx.referenceNumber }}
                </td>
                <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                  {{ tx.propertyTitle }}
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                    {{ tx.category }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-500">
                  {{ tx.paymentMethod }}
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {{ tx.status }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right font-bold whitespace-nowrap" [ngClass]="tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'">
                  {{ tx.type === 'INCOME' ? '+' : '-' }}{{ tx.amount | inrCurrency:'full' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class TransactionsComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  filteredTransactions = signal<Transaction[]>([]);

  activeFilter: 'ALL' | 'INCOME' | 'EXPENSE' = 'ALL';
  searchQuery = '';

  private demoTransactions: Transaction[] = [
    {
      id: 'tx-1',
      referenceNumber: 'TXN-2024-1104-991',
      propertyTitle: 'DLF Cybercity Office Bay 4B',
      type: 'INCOME',
      category: 'RENT',
      paymentMethod: 'NEFT Transfer',
      status: 'COMPLETED',
      amount: 215000,
      date: new Date('2024-11-01T10:30:00'),
      createdAt: new Date()
    },
    {
      id: 'tx-2',
      referenceNumber: 'TXN-2024-1103-812',
      propertyTitle: 'Hiranandani Estate – Rodas Enclave',
      type: 'INCOME',
      category: 'RENT',
      paymentMethod: 'ECS Auto-Credit',
      status: 'COMPLETED',
      amount: 58000,
      date: new Date('2024-11-03T11:15:00'),
      createdAt: new Date()
    },
    {
      id: 'tx-3',
      referenceNumber: 'TXN-2024-1104-510',
      propertyTitle: 'Sobha Dream Acres – Tower 14',
      type: 'INCOME',
      category: 'RENT',
      paymentMethod: 'UPI / GPay',
      status: 'COMPLETED',
      amount: 42000,
      date: new Date('2024-11-04T09:45:00'),
      createdAt: new Date()
    },
    {
      id: 'tx-4',
      referenceNumber: 'TXN-2024-1105-201',
      propertyTitle: 'Hiranandani Estate – Rodas Enclave',
      type: 'EXPENSE',
      category: 'MAINTENANCE',
      paymentMethod: 'Net Banking',
      status: 'COMPLETED',
      amount: 8200,
      date: new Date('2024-11-05T14:20:00'),
      createdAt: new Date()
    },
    {
      id: 'tx-5',
      referenceNumber: 'TXN-2024-1105-098',
      propertyTitle: 'HDFC Bank Home Loans',
      type: 'EXPENSE',
      category: 'EMI',
      paymentMethod: 'NACH Auto-Debit',
      status: 'COMPLETED',
      amount: 56430,
      date: new Date('2024-11-05T08:00:00'),
      createdAt: new Date()
    },
    {
      id: 'tx-6',
      referenceNumber: 'TXN-2024-1015-441',
      propertyTitle: 'Sobha Dream Acres – Tower 14',
      type: 'EXPENSE',
      category: 'PROPERTY_TAX',
      paymentMethod: 'BBMP Portal Payment',
      status: 'COMPLETED',
      amount: 14500,
      date: new Date('2024-10-15T16:30:00'),
      createdAt: new Date()
    }
  ];

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.api.getTransactions().subscribe({
      next: (res) => {
        if (res.data?.transactions?.length > 0) {
          this.transactions.set(res.data.transactions);
          this.filteredTransactions.set(res.data.transactions);
        } else {
          this.transactions.set(this.demoTransactions);
          this.filteredTransactions.set(this.demoTransactions);
        }
      },
      error: () => {
        this.transactions.set(this.demoTransactions);
        this.filteredTransactions.set(this.demoTransactions);
      }
    });
  }

  setFilter(filter: 'ALL' | 'INCOME' | 'EXPENSE'): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase().trim();
    const filter = this.activeFilter;

    const filtered = this.transactions().filter(tx => {
      const matchFilter = filter === 'ALL' || tx.type === filter;
      const matchQuery = !q ||
        (tx.referenceNumber || '').toLowerCase().includes(q) ||
        (tx.category || '').toLowerCase().includes(q) ||
        (tx.propertyTitle || '').toLowerCase().includes(q) ||
        (tx.paymentMethod || '').toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });

    this.filteredTransactions.set(filtered);
  }

  exportCsv(): void {
    this.toast.info('Downloading consolidated CSV transaction ledger...');
    window.open(this.api.getExportCsvUrl(), '_blank');
  }
}
