import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ComparisonItem {
  id: string;
  title: string;
  type: string;
  city: string;
  location: string;
  price: number;
  currentValuation: number;
  monthlyRent: number;
  grossYield: number;
  netYield: number;
  areaSqFt: number;
  pricePerSqFt: number;
  paybackYears: number;
  cagr5Year: number;
  configuration: string;
  tenant: string;
  imageUrl: string;
}

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InrCurrencyPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 mb-2">
            Multi-Asset Financial Benchmark
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Property Comparison Matrix
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare rental yields, capital growth, cost bases, and returns side-by-side to make data-backed investment decisions.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button
            (click)="resetComparison()"
            class="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            Reset Comparison
          </button>
          <button
            (click)="exportComparison()"
            class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export Comparison Matrix
          </button>
        </div>
      </div>

      <!-- Quick Asset Selector -->
      <div class="bg-white dark:bg-[#14213D] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        <span class="text-slate-500 font-medium">Add asset to comparison:</span>
        <div class="flex flex-wrap gap-2">
          <button
            *ngFor="let opt of availablePool"
            (click)="addPropertyToCompare(opt)"
            [disabled]="isAlreadyCompared(opt.id)"
            class="px-3 py-1.5 rounded-xl border font-semibold transition-all"
            [ngClass]="isAlreadyCompared(opt.id) ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400' : 'bg-slate-50 dark:bg-slate-800 hover:border-blue-500 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'"
          >
            + {{ opt.title }}
          </button>
        </div>
      </div>

      <!-- Visual Yield & Valuation Comparison Chart -->
      <div class="bg-white dark:bg-[#14213D] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">
              Financial Benchmark Chart
            </h3>
            <p class="text-xs text-slate-400">Comparing Cost Basis (₹) vs Gross Rental Yield (%)</p>
          </div>
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
            Live Comparison
          </span>
        </div>
        <div class="h-64 relative">
          <canvas #compareChartCanvas></canvas>
        </div>
      </div>

      <!-- Side-by-Side Comparison Table Matrix -->
      <div class="bg-white dark:bg-[#14213D] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                <th class="py-4 px-5 text-slate-400 uppercase font-bold tracking-wider w-48">
                  Metrics & Attributes
                </th>
                <th
                  *ngFor="let item of comparedItems()"
                  class="py-4 px-5 min-w-[260px] text-slate-900 dark:text-white font-bold align-top"
                >
                  <div class="space-y-3">
                    <div class="relative h-32 w-full rounded-xl overflow-hidden bg-slate-900">
                      <img [src]="item.imageUrl" [alt]="item.title" class="w-full h-full object-cover"/>
                      <button
                        (click)="removeItem(item.id)"
                        class="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors"
                        title="Remove from comparison"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    <div>
                      <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {{ item.type }} • {{ item.city }}
                      </span>
                      <h4 class="font-bold text-sm leading-tight text-slate-900 dark:text-white mt-0.5">
                        {{ item.title }}
                      </h4>
                      <p class="text-[11px] text-slate-400">{{ item.location }}</p>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <!-- Acquisition Price -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Purchase / Asking Price</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5 font-extrabold text-slate-900 dark:text-white text-sm">
                  {{ item.price | inrCurrency:'full' }}
                </td>
              </tr>

              <!-- Current Valuation -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Current Valuation</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5 font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  {{ item.currentValuation | inrCurrency:'full' }}
                </td>
              </tr>

              <!-- Gross Rental Yield -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Gross Rental Yield</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5 font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                  {{ item.grossYield }}% p.a.
                </td>
              </tr>

              <!-- Net Rental Yield -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Net Rental Yield</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5 font-semibold text-emerald-600 dark:text-emerald-400">
                  {{ item.netYield }}% p.a.
                </td>
              </tr>

              <!-- Monthly Rental Income -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Monthly Rental Income</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5 font-bold text-blue-600 dark:text-blue-400">
                  {{ item.monthlyRent | inrCurrency:'full' }}/mo
                </td>
              </tr>

              <!-- Super Area & Rate -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Area & Rate/Sq.Ft</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5">
                  <span class="font-bold text-slate-900 dark:text-white">{{ item.areaSqFt }} sq.ft</span>
                  <span class="text-slate-400 block text-[11px]">(₹{{ item.pricePerSqFt | inrCurrency }}/sq.ft)</span>
                </td>
              </tr>

              <!-- 5-Year CAGR -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Projected 5-Yr CAGR</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5 font-bold text-emerald-600">
                  +{{ item.cagr5Year }}% p.a.
                </td>
              </tr>

              <!-- Payback Period -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Gross Payback Horizon</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5 font-medium text-slate-700 dark:text-slate-300">
                  ~{{ item.paybackYears }} Years
                </td>
              </tr>

              <!-- Configuration -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Asset Configuration</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5 font-medium text-slate-700 dark:text-slate-300">
                  {{ item.configuration }}
                </td>
              </tr>

              <!-- Tenant Profile -->
              <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td class="py-3.5 px-5 font-semibold text-slate-500">Current Occupant / Tenant</td>
                <td *ngFor="let item of comparedItems()" class="py-3.5 px-5 font-semibold text-slate-900 dark:text-white">
                  {{ item.tenant }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class ComparisonComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('compareChartCanvas') compareChartCanvas!: ElementRef<HTMLCanvasElement>;
  private compareChart: Chart | null = null;

  availablePool: ComparisonItem[] = [
    {
      id: 'prop-1',
      title: 'Sobha Dream Acres (Tower 14)',
      type: 'RESIDENTIAL',
      city: 'Bengaluru',
      location: 'Panathur Main Road, Marathahalli-ORR',
      price: 9200000,
      currentValuation: 12800000,
      monthlyRent: 42000,
      grossYield: 5.48,
      netYield: 4.62,
      areaSqFt: 1205,
      pricePerSqFt: 7635,
      paybackYears: 18.2,
      cagr5Year: 11.5,
      configuration: '2 BHK • 2 Baths',
      tenant: 'Rahul Kulkarni (Tech Mahindra)',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
    },
    {
      id: 'prop-2',
      title: 'Hiranandani Estate (Rodas Enclave)',
      type: 'RESIDENTIAL',
      city: 'Mumbai MMR',
      location: 'Ghodbunder Road, Thane West',
      price: 17500000,
      currentValuation: 23500000,
      monthlyRent: 58000,
      grossYield: 3.98,
      netYield: 3.25,
      areaSqFt: 1450,
      pricePerSqFt: 12068,
      paybackYears: 25.1,
      cagr5Year: 9.8,
      configuration: '3 BHK • 3 Baths',
      tenant: 'Amit Sharma (TCS Executive)',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    },
    {
      id: 'prop-3',
      title: 'DLF Cybercity Tech Park Office Bay 4B',
      type: 'COMMERCIAL',
      city: 'Gurugram',
      location: 'Sector 25A, Cyber City Phase 2',
      price: 32000000,
      currentValuation: 41000000,
      monthlyRent: 215000,
      grossYield: 8.06,
      netYield: 7.20,
      areaSqFt: 2400,
      pricePerSqFt: 13333,
      paybackYears: 12.4,
      cagr5Year: 14.2,
      configuration: 'Grade A Warm Shell Office',
      tenant: 'S&P Global India Pvt Ltd',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'
    },
    {
      id: 'mkt-1',
      title: 'EON Free Zone – Grade A Floor',
      type: 'COMMERCIAL',
      city: 'Pune',
      location: 'Kharadi IT Park',
      price: 45000000,
      currentValuation: 45000000,
      monthlyRent: 337500,
      grossYield: 9.00,
      netYield: 8.10,
      areaSqFt: 3500,
      pricePerSqFt: 12857,
      paybackYears: 11.1,
      cagr5Year: 13.5,
      configuration: 'Commercial Floor with 10 Car Parks',
      tenant: 'Barclays Global Services',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    }
  ];

  comparedItems = signal<ComparisonItem[]>([]);

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    // Default 3 assets compared for rich showcase
    this.comparedItems.set(this.availablePool.slice(0, 3));
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    if (this.compareChart) {
      this.compareChart.destroy();
    }
  }

  isAlreadyCompared(id: string): boolean {
    return this.comparedItems().some(i => i.id === id);
  }

  addPropertyToCompare(opt: ComparisonItem): void {
    if (this.comparedItems().length >= 4) {
      this.toast.info('Maximum 4 properties can be compared simultaneously.');
      return;
    }
    this.comparedItems.update(prev => [...prev, opt]);
    this.toast.success(`Added "${opt.title}" to comparison matrix.`);
    this.renderChart();
  }

  removeItem(id: string): void {
    if (this.comparedItems().length <= 1) {
      this.toast.info('At least one property must remain in comparison.');
      return;
    }
    this.comparedItems.update(prev => prev.filter(i => i.id !== id));
    this.renderChart();
  }

  resetComparison(): void {
    this.comparedItems.set(this.availablePool.slice(0, 3));
    this.toast.info('Comparison matrix reset to primary assets.');
    this.renderChart();
  }

  exportComparison(): void {
    this.toast.success('Generated PDF Comparison Sheet for selected properties.');
    window.open(this.api.getReportDownloadUrl('portfolio', 'pdf'), '_blank');
  }

  private renderChart(): void {
    if (!this.compareChartCanvas) return;
    const ctx = this.compareChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.compareChart) {
      this.compareChart.destroy();
    }

    const labels = this.comparedItems().map(i => i.title.split('(')[0].trim());
    const yields = this.comparedItems().map(i => i.grossYield);
    const pricesInCr = this.comparedItems().map(i => Number((i.price / 10000000).toFixed(2)));

    this.compareChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cost / Value (₹ Crores)',
            data: pricesInCr,
            backgroundColor: '#2563EB',
            borderRadius: 6,
            yAxisID: 'y'
          },
          {
            label: 'Gross Rental Yield (%)',
            data: yields,
            backgroundColor: '#10B981',
            borderRadius: 6,
            yAxisID: 'y1'
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
            type: 'linear',
            position: 'left',
            title: { display: true, text: 'Valuation (₹ Cr)' }
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Yield (%)' }
          }
        }
      }
    });
  }
}
