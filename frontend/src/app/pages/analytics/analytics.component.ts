import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Investment Analytics & ROI
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep financial performance metrics, IRR estimation, cash flow health, and capital growth modeling.
          </p>
        </div>

        <!-- Period Toggle -->
        <div class="flex items-center space-x-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            (click)="setPeriod('MONTHLY')"
            class="px-3 py-1.5 rounded-lg transition-all"
            [ngClass]="period() === 'MONTHLY' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'"
          >
            Monthly
          </button>
          <button
            (click)="setPeriod('QUARTERLY')"
            class="px-3 py-1.5 rounded-lg transition-all"
            [ngClass]="period() === 'QUARTERLY' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'"
          >
            Quarterly
          </button>
          <button
            (click)="setPeriod('YEARLY')"
            class="px-3 py-1.5 rounded-lg transition-all"
            [ngClass]="period() === 'YEARLY' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'"
          >
            Yearly
          </button>
        </div>
      </div>

      <!-- High-Level Financial KPI Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Portfolio CAGR -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Portfolio CAGR</span>
            <div class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
          <div class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            14.2% <span class="text-xs font-normal text-slate-400">p.a.</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Outperforming Nifty Realty (11.8%)</p>
        </div>

        <!-- 2. Gross Rental Yield -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Gross Portfolio Yield</span>
            <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
          <div class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            6.35%
          </div>
          <p class="text-xs text-slate-500 mt-1">Net of maintenance & taxes: <strong>5.12%</strong></p>
        </div>

        <!-- 3. Total Cash Flow Generated -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Net Annual Cash Flow</span>
            <div class="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {{ 2145000 | inrCurrency:'full' }}
          </div>
          <p class="text-xs text-slate-500 mt-1">₹1,78,750 avg monthly surplus</p>
        </div>

        <!-- 4. Portfolio LTV (Leverage) -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <span>Loan-To-Value (LTV)</span>
            <div class="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
              </svg>
            </div>
          </div>
          <div class="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            38.5%
          </div>
          <p class="text-xs text-slate-500 mt-1">Healthy gearing (&lt; 50% target)</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 1. Cumulative Capital Growth Chart -->
        <div class="bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
                Capital Valuation Growth Trajectory
              </h3>
              <p class="text-xs text-slate-400">Invested Capital vs Market Valuation (INR in Crores)</p>
            </div>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
              +42.8% Total Gain
            </span>
          </div>
          <div class="h-64 relative">
            <canvas #growthChartCanvas></canvas>
          </div>
        </div>

        <!-- 2. Cash Flow Dynamics (Income vs Debt & Opex) -->
        <div class="bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
                Cash Flow Dynamics
              </h3>
              <p class="text-xs text-slate-400">Gross Rental vs EMI & Maintenance Outflow (Last 6 Months)</p>
            </div>
            <span class="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg">
              Positive Cashflow
            </span>
          </div>
          <div class="h-64 relative">
            <canvas #cashFlowChartCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- Property Performance Breakdown Table -->
      <div class="bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
              Asset Level Return & Yield Matrix
            </h3>
            <p class="text-xs text-slate-400">Individual property performance benchmarks and yield calculations</p>
          </div>
          <a routerLink="/properties" class="text-xs font-semibold text-blue-600 hover:underline">
            View All Properties
          </a>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3 px-4">Property</th>
                <th class="py-3 px-4">City</th>
                <th class="py-3 px-4">Purchase Price</th>
                <th class="py-3 px-4">Current Valuation</th>
                <th class="py-3 px-4">Appreciation</th>
                <th class="py-3 px-4">Monthly Rent</th>
                <th class="py-3 px-4">Gross Yield</th>
                <th class="py-3 px-4">Net Yield</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Sobha Dream Acres (Tower 14)
                </td>
                <td class="py-3.5 px-4">Bengaluru</td>
                <td class="py-3.5 px-4">{{ 9200000 | inrCurrency:'full' }}</td>
                <td class="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{{ 12800000 | inrCurrency:'full' }}</td>
                <td class="py-3.5 px-4 font-bold text-emerald-600">+39.1%</td>
                <td class="py-3.5 px-4">{{ 42000 | inrCurrency:'full' }}</td>
                <td class="py-3.5 px-4 font-semibold text-indigo-600">5.48%</td>
                <td class="py-3.5 px-4 font-semibold text-emerald-600">4.62%</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Hiranandani Estate (Rodas Enclave)
                </td>
                <td class="py-3.5 px-4">Mumbai MMR</td>
                <td class="py-3.5 px-4">{{ 17500000 | inrCurrency:'full' }}</td>
                <td class="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{{ 23500000 | inrCurrency:'full' }}</td>
                <td class="py-3.5 px-4 font-bold text-emerald-600">+34.3%</td>
                <td class="py-3.5 px-4">{{ 58000 | inrCurrency:'full' }}</td>
                <td class="py-3.5 px-4 font-semibold text-indigo-600">3.98%</td>
                <td class="py-3.5 px-4 font-semibold text-emerald-600">3.25%</td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td class="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  DLF Cybercity Office Bay 4B
                </td>
                <td class="py-3.5 px-4">Gurugram</td>
                <td class="py-3.5 px-4">{{ 32000000 | inrCurrency:'full' }}</td>
                <td class="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{{ 41000000 | inrCurrency:'full' }}</td>
                <td class="py-3.5 px-4 font-bold text-emerald-600">+28.1%</td>
                <td class="py-3.5 px-4">{{ 215000 | inrCurrency:'full' }}</td>
                <td class="py-3.5 px-4 font-semibold text-indigo-600">8.06%</td>
                <td class="py-3.5 px-4 font-semibold text-emerald-600">7.20%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  period = signal<'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('YEARLY');

  @ViewChild('growthChartCanvas') growthChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cashFlowChartCanvas') cashFlowChartCanvas!: ElementRef<HTMLCanvasElement>;

  private growthChart: Chart | null = null;
  private cashFlowChart: Chart | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  ngOnDestroy(): void {
    if (this.growthChart) this.growthChart.destroy();
    if (this.cashFlowChart) this.cashFlowChart.destroy();
  }

  setPeriod(p: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'): void {
    this.period.set(p);
    this.loadData();
  }

  private loadData(): void {
    this.api.getInvestmentAnalytics(this.period()).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  private renderCharts(): void {
    // 1. Growth Chart
    if (this.growthChartCanvas) {
      const ctx = this.growthChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.growthChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2020', '2021', '2022', '2023', '2024', 'Current'],
            datasets: [
              {
                label: 'Market Valuation (₹ Cr)',
                data: [5.87, 6.25, 6.78, 7.15, 7.52, 7.73],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.35,
                borderWidth: 2.5
              },
              {
                label: 'Cost Basis / Invested (₹ Cr)',
                data: [5.87, 5.87, 5.87, 5.87, 5.87, 5.87],
                borderColor: '#94A3B8',
                borderDash: [5, 5],
                fill: false,
                tension: 0,
                borderWidth: 1.5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
            },
            scales: {
              y: {
                beginAtZero: false,
                ticks: {
                  callback: (val) => '₹' + val + ' Cr'
                }
              }
            }
          }
        });
      }
    }

    // 2. Cash Flow Dynamics Bar Chart
    if (this.cashFlowChartCanvas) {
      const ctx = this.cashFlowChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.cashFlowChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            datasets: [
              {
                label: 'Gross Rental Income (₹)',
                data: [315000, 315000, 315000, 315000, 315000, 315000],
                backgroundColor: '#2563EB',
                borderRadius: 6
              },
              {
                label: 'EMI & Outflows (₹)',
                data: [136250, 136250, 142000, 136250, 136250, 136250],
                backgroundColor: '#F43F5E',
                borderRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
            },
            scales: {
              y: {
                ticks: {
                  callback: (val) => '₹' + (Number(val) / 1000) + 'k'
                }
              }
            }
          }
        });
      }
    }
  }
}
