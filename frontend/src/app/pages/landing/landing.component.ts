import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#1E293B] dark:text-[#F8FAFC]">
      <!-- Public Navigation Bar -->
      <header class="sticky top-0 z-50 bg-white/90 dark:bg-[#14213D]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">PropVest</span>
              <span class="text-[10px] tracking-widest text-emerald-600 dark:text-emerald-400 font-bold uppercase">REAL ESTATE FINTECH</span>
            </div>
          </a>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" class="hover:text-blue-600 dark:hover:text-white transition-colors">Platform Features</a>
            <a href="#how-it-works" class="hover:text-blue-600 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#analytics-preview" class="hover:text-blue-600 dark:hover:text-white transition-colors">ROI Calculator</a>
            <a href="#featured-properties" class="hover:text-blue-600 dark:hover:text-white transition-colors">Marketplace</a>
            <a href="#faq" class="hover:text-blue-600 dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-4">
            <a
              routerLink="/login"
              class="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </a>
            <a
              routerLink="/register"
              class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Left Copy -->
            <div class="lg:col-span-7 space-y-6">
              <div class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Next-Gen Indian Real Estate Portfolio Platform
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight leading-[1.15]">
                Manage Smarter. <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500">Invest Better.</span> <br/>
                Grow Your Property Portfolio.
              </h1>

              <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                One intelligent platform to manage properties, track rental income and understand your real estate investments. Built specifically for high-growth Indian investors and asset managers.
              </p>

              <!-- CTA Group -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <a
                  routerLink="/register"
                  class="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                >
                  Get Started
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>
                <a
                  routerLink="/marketplace"
                  class="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-slate-800 dark:text-white bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
                >
                  Explore Properties
                </a>
              </div>

              <!-- Trust Stats -->
              <div class="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white font-heading">₹120+ Cr</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Portfolio Assets Managed</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white font-heading">8.4%</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Average Commercial Yield</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white font-heading">100%</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Data Privacy & Security</p>
                </div>
              </div>
            </div>

            <!-- Right Visual Dashboard Card -->
            <div class="lg:col-span-5 relative">
              <div class="relative mx-auto max-w-md lg:max-w-none">
                <!-- Glowing Backdrop -->
                <div class="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Mockup Preview Card -->
                <div class="relative bg-white dark:bg-[#14213D] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-6">
                  <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div class="flex items-center space-x-3">
                      <div class="w-3 h-3 rounded-full bg-red-400"></div>
                      <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                      Live INR Analytics
                    </span>
                  </div>

                  <!-- Mock KPI Highlights -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                      <p class="text-xs text-slate-500 dark:text-slate-400">Total Portfolio Value</p>
                      <p class="text-lg font-bold text-slate-900 dark:text-white mt-1">₹ 2.45 Cr</p>
                      <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
                        ↑ +27.6% Unrealized ROI
                      </span>
                    </div>
                    <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                      <p class="text-xs text-slate-500 dark:text-slate-400">Monthly Rental Flow</p>
                      <p class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">₹ 1,18,000</p>
                      <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        3 Active Leases
                      </span>
                    </div>
                  </div>

                  <!-- Mini Progress / Distribution Bar -->
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span>Asset Allocation</span>
                      <span>Residential 65% · Commercial 35%</span>
                    </div>
                    <div class="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                      <div class="bg-blue-600 h-full w-[65%]"></div>
                      <div class="bg-emerald-500 h-full w-[35%]"></div>
                    </div>
                  </div>

                  <!-- Property Snapshot item -->
                  <div class="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <img
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200"
                      class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      alt="Property"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-slate-900 dark:text-white truncate">Prestige Tech Park 3BHK</p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">Whitefield, Bengaluru</p>
                    </div>
                    <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      +27.6% ROI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Platform Features -->
      <section id="features" class="py-20 bg-white dark:bg-[#14213D] border-y border-slate-200 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Institutional Power for Individual Investors</h2>
            <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              Everything you need to master your property wealth.
            </p>
            <p class="text-slate-600 dark:text-slate-300">
              Replace messy spreadsheets with automated real-time financial tracking, precision EMI schedules, and institutional-grade valuation analytics.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <!-- Feature 1 -->
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Portfolio Valuation & ROI</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Track current market valuations against historical purchase prices. Automatically compute unrealized capital gains, annualized returns (CAGR), and net ROI.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Rental Income & Tenant Leases</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Log tenant agreements, security deposits, monthly escalation clauses, and track overdue or paid rent. Calculate gross and net rental yields effortlessly.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Home Loans & Amortization</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Reducing-balance EMI formulas compute exact principal vs. interest components. See full amortization schedules and true net monthly cash flow.
              </p>
            </div>

            <!-- Feature 4 -->
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Marketplace Discovery & Compare</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Explore curated residential, commercial and industrial investment listings in Bengaluru, Mumbai, Gurugram and Pune. Compare up to 4 assets side-by-side.
              </p>
            </div>

            <!-- Feature 5 -->
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Executive PDF & CSV Reports</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Generate branded PDF statements and CSV exports for your tax filings, banking loan assessments, and co-investor updates with a single click.
              </p>
            </div>

            <!-- Feature 6 -->
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-lg transition-all">
              <div class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white font-heading">Encrypted Document Vault</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Securely store Sale Deeds, BBMP/BMC Tax Receipts, Encumbrance Certificates, and Insurance policies linked directly to individual properties.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- How PropVest Works -->
      <section id="how-it-works" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Streamlined Workflow</h2>
            <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">How PropVest Works</p>
            <p class="text-slate-600 dark:text-slate-300">Start organizing your real estate wealth in four simple steps.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            <div class="relative flex flex-col items-center text-center p-6 bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-md shadow-blue-500/20">1</div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white font-heading">Add Your Assets</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-2">Enter purchase price, current market valuation, area, and location specifications.</p>
            </div>

            <div class="relative flex flex-col items-center text-center p-6 bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-md shadow-emerald-500/20">2</div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white font-heading">Attach Leases & Loans</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-2">Link active tenant contracts, security deposits, and bank loan EMI structures.</p>
            </div>

            <div class="relative flex flex-col items-center text-center p-6 bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-md shadow-indigo-500/20">3</div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white font-heading">Track Cash Flow</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-2">Log rent payments, property taxes, HOA fees and review true monthly net profits.</p>
            </div>

            <div class="relative flex flex-col items-center text-center p-6 bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="w-12 h-12 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-lg mb-4 shadow-md shadow-blue-700/20">4</div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white font-heading">Scale & Optimize</h3>
              <p class="text-xs text-slate-600 dark:text-slate-400 mt-2">Analyze ROI trends and discover verified, high-yield marketplace opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Investment Analytics Interactive Preview (ROI Calculator) -->
      <section id="analytics-preview" class="py-20 bg-white dark:bg-[#14213D] border-y border-slate-200 dark:border-slate-800">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto space-y-4">
            <h2 class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Interactive Simulation</h2>
            <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">Live Investment Calculator</p>
            <p class="text-slate-600 dark:text-slate-300">Simulate capital appreciation, rental yield, and cash flow using real formula metrics.</p>
          </div>

          <div class="mt-12 p-8 bg-slate-50 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <!-- Sliders -->
              <div class="space-y-6">
                <div>
                  <div class="flex justify-between text-sm font-semibold mb-2">
                    <span class="text-slate-700 dark:text-slate-300">Purchase Price</span>
                    <span class="text-blue-600 dark:text-blue-400 font-bold">{{ purchasePrice() | inrCurrency:'compact' }}</span>
                  </div>
                  <input
                    type="range"
                    min="2000000"
                    max="100000000"
                    step="500000"
                    [value]="purchasePrice()"
                    (input)="updatePurchase($event)"
                    class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div class="flex justify-between text-sm font-semibold mb-2">
                    <span class="text-slate-700 dark:text-slate-300">Estimated Current Market Value</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ currentValuation() | inrCurrency:'compact' }}</span>
                  </div>
                  <input
                    type="range"
                    min="2000000"
                    max="150000000"
                    step="500000"
                    [value]="currentValuation()"
                    (input)="updateValuation($event)"
                    class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <div class="flex justify-between text-sm font-semibold mb-2">
                    <span class="text-slate-700 dark:text-slate-300">Monthly Rental Income</span>
                    <span class="text-indigo-600 dark:text-indigo-400 font-bold">{{ monthlyRent() | inrCurrency }} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    [value]="monthlyRent()"
                    (input)="updateRent($event)"
                    class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              <!-- Output Box -->
              <div class="bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
                <h4 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Calculated Metrics</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Total Return on Investment</p>
                    <p class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">
                      {{ calculatedRoi() }}%
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Gross Rental Yield</p>
                    <p class="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-heading">
                      {{ calculatedGrossYield() }}%
                    </p>
                  </div>
                </div>

                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div class="flex justify-between">
                    <span class="text-slate-600 dark:text-slate-400">Capital Appreciation:</span>
                    <span class="font-bold text-slate-900 dark:text-white">{{ (currentValuation() - purchasePrice()) | inrCurrency }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600 dark:text-slate-400">Annual Rental Cash Flow:</span>
                    <span class="font-bold text-slate-900 dark:text-white">{{ (monthlyRent() * 12) | inrCurrency }} / yr</span>
                  </div>
                </div>

                <a
                  routerLink="/register"
                  class="w-full mt-4 inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Track in PropVest Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Demo Properties -->
      <section id="featured-properties" class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Real Opportunities</h2>
              <p class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading mt-2">
                Featured Marketplace Properties
              </p>
            </div>
            <a
              routerLink="/marketplace"
              class="mt-4 md:mt-0 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
            >
              View all listings
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Property 1 -->
            <div class="bg-white dark:bg-[#14213D] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div class="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Bangalore Sky Villa"
                />
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-[#1E293B]/90 text-slate-800 dark:text-white backdrop-blur-sm">
                  Hebbal, Bengaluru
                </span>
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white">
                  4.65% Yield
                </span>
              </div>
              <div class="p-5 space-y-3">
                <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Godrej Woodsman 4BHK Sky Villa</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Bellary Road · 2,850 sqft · Luxury Condominium</p>
                <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p class="text-[10px] text-slate-400">Offer Price</p>
                    <p class="text-sm font-extrabold text-slate-900 dark:text-white">{{ 24500000 | inrCurrency:'compact' }}</p>
                  </div>
                  <a
                    routerLink="/marketplace"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>

            <!-- Property 2 -->
            <div class="bg-white dark:bg-[#14213D] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div class="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Mumbai Commercial"
                />
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-[#1E293B]/90 text-slate-800 dark:text-white backdrop-blur-sm">
                  Lower Parel, Mumbai
                </span>
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                  8.36% High Yield
                </span>
              </div>
              <div class="p-5 space-y-3">
                <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Lodha World One Commercial Floor</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Senapati Bapat Marg · 3,600 sqft · Pre-leased Grade A</p>
                <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p class="text-[10px] text-slate-400">Offer Price</p>
                    <p class="text-sm font-extrabold text-slate-900 dark:text-white">{{ 89000000 | inrCurrency:'compact' }}</p>
                  </div>
                  <a
                    routerLink="/marketplace"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>

            <!-- Property 3 -->
            <div class="bg-white dark:bg-[#14213D] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
              <div class="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Pune Industrial"
                />
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-[#1E293B]/90 text-slate-800 dark:text-white backdrop-blur-sm">
                  Chakan, Pune
                </span>
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                  9.25% Yield
                </span>
              </div>
              <div class="p-5 space-y-3">
                <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">LogiParks Grade-A Warehouse</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">MIDC Phase 2 · 18,500 sqft · Auto Logistics Hub</p>
                <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p class="text-[10px] text-slate-400">Offer Price</p>
                    <p class="text-sm font-extrabold text-slate-900 dark:text-white">{{ 48000000 | inrCurrency:'compact' }}</p>
                  </div>
                  <a
                    routerLink="/marketplace"
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Illustrative Testimonials -->
      <section class="py-20 bg-white dark:bg-[#14213D] border-t border-slate-200 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto space-y-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sample Feedback (Demo Profiles)</span>
            <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Trusted by Discerning Investors</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "PropVest completely eliminated my Excel headaches. I manage four properties in Bangalore and Mumbai, and seeing true net monthly cash flow after EMI auto-debits is game-changing."
              </p>
              <div class="mt-4 flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">VM</div>
                <div>
                  <p class="text-xs font-bold text-slate-900 dark:text-white">Vikram Malhotra</p>
                  <p class="text-[10px] text-slate-500">Portfolio Owner, Bengaluru</p>
                </div>
              </div>
            </div>

            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "The loan amortization and tenant tracking features alone make PropVest worth every second. Rent due alerts and instant PDF summaries make tax filing effortless."
              </p>
              <div class="mt-4 flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">AS</div>
                <div>
                  <p class="text-xs font-bold text-slate-900 dark:text-white">Ananya Sen</p>
                  <p class="text-[10px] text-slate-500">Commercial Real Estate Investor, Mumbai</p>
                </div>
              </div>
            </div>

            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "Comparing marketplace opportunities against my current portfolio yield helps me allocate capital with data instead of broker guesswork."
              </p>
              <div class="mt-4 flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">RK</div>
                <div>
                  <p class="text-xs font-bold text-slate-900 dark:text-white">Rohan Kulkarni</p>
                  <p class="text-[10px] text-slate-500">Asset Manager, Pune</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="py-20 bg-slate-50 dark:bg-[#0B1120]">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center space-y-4 mb-12">
            <h2 class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Got Questions?</h2>
            <p class="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Frequently Asked Questions</p>
          </div>

          <div class="space-y-4">
            <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white font-heading">What is PropVest?</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                PropVest is a modern SaaS platform designed for property owners and real estate investors in India to track valuations, rental income, operating expenses, and home loans in one centralized place.
              </p>
            </div>

            <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white font-heading">How does PropVest calculate ROI and rental yield?</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Gross Rental Yield is computed as Annual Rental Income divided by Current Valuation. Net Yield additionally subtracts maintenance, taxes, and operating expenses. ROI reflects unrealized capital gains relative to your original purchase cost.
              </p>
            </div>

            <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white font-heading">Is my financial and property data private?</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Yes. Every portfolio record is strictly isolated to your authenticated account with JWT authorization and database-level user boundary checks.
              </p>
            </div>

            <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white font-heading">Can I export reports for my tax accountant?</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Absolutely. You can export Portfolio Summaries, Rental Income Statements, Expense Breakdowns, and Mortgage EMI schedules in both PDF and CSV formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-[#14213D] text-white py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <span class="text-lg font-bold font-heading">PropVest</span>
          </div>

          <p class="text-xs text-slate-400">
            © 2026 PropVest Platforms Pvt Ltd. Built with Angular & Node.js. Default currency INR (₹).
          </p>

          <div class="flex space-x-6 text-xs text-slate-400">
            <a routerLink="/login" class="hover:text-white transition-colors">Sign In</a>
            <a routerLink="/register" class="hover:text-white transition-colors">Register</a>
            <a routerLink="/marketplace" class="hover:text-white transition-colors">Marketplace</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class LandingComponent {
  purchasePrice = signal<number>(14500000);
  currentValuation = signal<number>(18500000);
  monthlyRent = signal<number>(58000);

  updatePurchase(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.purchasePrice.set(val);
  }

  updateValuation(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.currentValuation.set(val);
  }

  updateRent(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.monthlyRent.set(val);
  }

  calculatedRoi(): number {
    if (this.purchasePrice() <= 0) return 0;
    return Number((((this.currentValuation() - this.purchasePrice()) / this.purchasePrice()) * 100).toFixed(2));
  }

  calculatedGrossYield(): number {
    if (this.currentValuation() <= 0) return 0;
    return Number((((this.monthlyRent() * 12) / this.currentValuation()) * 100).toFixed(2));
  }
}
