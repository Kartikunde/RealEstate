import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardOverview, Property, Transaction, Notification } from '../../core/models';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, InrCurrencyPipe],
  template: `
    <div class="space-y-8">
      <!-- Welcome Header & Quick Action -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Investor Dashboard
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span class="font-semibold text-slate-800 dark:text-slate-200">{{ authService.currentUser()?.name || 'Investor' }}</span>. Here is your portfolio performance summary.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <a
            routerLink="/reports"
            class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            <svg class="w-4 h-4 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export PDF Statement
          </a>
          <a
            routerLink="/properties/add"
            class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Property
          </a>
        </div>
      </div>

      <!-- Database Offline / Error Notice -->
      <div *ngIf="backendError()" class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-start space-x-3">
        <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div class="flex-1">
          <h4 class="text-xs font-bold text-amber-900 dark:text-amber-200">Local Database Service Offline Notice</h4>
          <p class="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
            The PostgreSQL database service on localhost:5432 is currently stopped. Showing cached/fallback investment portfolio metrics.
          </p>
        </div>
        <button
          (click)="loadData()"
          class="px-3 py-1 rounded-lg text-xs font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 hover:bg-amber-300"
        >
          Retry
        </button>
      </div>

      <!-- Loading State Skeleton -->
      <div *ngIf="loading()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 animate-pulse">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="h-28 bg-white dark:bg-[#14213D] rounded-2xl border border-slate-200 dark:border-slate-800 p-4"></div>
      </div>

      <!-- 6 KPI Cards -->
      <div *ngIf="!loading()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <!-- 1. Total Portfolio Value -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Portfolio Value</span>
            <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
          </div>
          <p class="text-xl font-extrabold text-slate-900 dark:text-white mt-3 font-heading">
            {{ overview()?.kpis?.totalPortfolioValue | inrCurrency:'compact' }}
          </p>
          <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center mt-1">
            +{{ overview()?.kpis?.averageRoi }}% Overall ROI
          </span>
        </div>

        <!-- 2. Total Investment -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Invested</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
          <p class="text-xl font-extrabold text-slate-900 dark:text-white mt-3 font-heading">
            {{ overview()?.kpis?.totalInvestment | inrCurrency:'compact' }}
          </p>
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
            {{ overview()?.kpis?.propertyCount }} Properties Acquired
          </span>
        </div>

        <!-- 3. Total Rental Income -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rental Inflow</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-3 font-heading">
            {{ overview()?.kpis?.totalRentalIncome | inrCurrency }}
          </p>
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
            {{ overview()?.kpis?.occupancyRate }}% Occupancy Rate
          </span>
        </div>

        <!-- 4. Total Expenses -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Operating Costs</span>
            <div class="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p class="text-xl font-extrabold text-slate-900 dark:text-white mt-3 font-heading">
            {{ overview()?.kpis?.totalExpenses | inrCurrency }}
          </p>
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
            HOA, Taxes, Insurance
          </span>
        </div>

        <!-- 5. Net Profit -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Cash Flow</span>
            <div class="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p class="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-3 font-heading">
            {{ overview()?.kpis?.netProfit | inrCurrency }}
          </p>
          <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
            Positive Cash Margin
          </span>
        </div>

        <!-- 6. Average ROI -->
        <div class="bg-white dark:bg-[#14213D] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unrealized Gain</span>
            <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
          <p class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-3 font-heading">
            +{{ overview()?.kpis?.unrealizedGain | inrCurrency:'compact' }}
          </p>
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
            Capital Growth
          </span>
        </div>
      </div>

      <!-- Charts Row 1: Portfolio Growth & Property Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Chart A: Portfolio Growth Line Chart -->
        <div class="lg:col-span-8 bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Portfolio Valuation Growth</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Invested Capital vs. Current Market Valuation Trend</p>
            </div>
            <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              5-Year Projection
            </span>
          </div>
          <div class="relative h-72 w-full">
            <canvas #growthChartCanvas></canvas>
          </div>
        </div>

        <!-- Chart B: Asset Class Distribution Doughnut Chart -->
        <div class="lg:col-span-4 bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Asset Allocation</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Distribution by Property Category</p>
            </div>
          </div>
          <div class="relative h-72 w-full flex items-center justify-center">
            <canvas #distributionChartCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- Charts Row 2: Income vs Expense & Investment Returns -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Chart C: Monthly Cash Flow Bar Chart -->
        <div class="lg:col-span-7 bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Monthly Income vs Expenses</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Gross Rental Receipts vs. Outflow Obligations</p>
            </div>
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">Last 6 Months</span>
          </div>
          <div class="relative h-64 w-full">
            <canvas #cashflowChartCanvas></canvas>
          </div>
        </div>

        <!-- Chart D: Performance / Occupancy Gauge -->
        <div class="lg:col-span-5 bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Portfolio Performance Health</h3>
              <span class="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Optimal
              </span>
            </div>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-600 dark:text-slate-300">Occupancy Ratio</span>
                  <span class="text-blue-600 dark:text-blue-400 font-bold">{{ overview()?.kpis?.occupancyRate }}%</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="bg-blue-600 h-full rounded-full transition-all" [style.width.%]="overview()?.kpis?.occupancyRate || 80"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-600 dark:text-slate-300">Loan Debt-to-Value (LTV)</span>
                  <span class="text-indigo-600 dark:text-indigo-400 font-bold">42.5%</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="bg-indigo-600 h-full rounded-full w-[42.5%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-slate-600 dark:text-slate-300">Net Rental Yield</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold">5.8% (Target: >5%)</span>
                </div>
                <div class="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full rounded-full w-[78%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Active Debt Portfolio</p>
              <p class="text-[11px] text-slate-500">2 active bank home loans under auto-debit</p>
            </div>
            <a routerLink="/loans" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Manage Loans →
            </a>
          </div>
        </div>
      </div>

      <!-- Properties & Recent Transactions Row -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- My Properties Highlights -->
        <div class="lg:col-span-7 bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">My Portfolio Holdings</h3>
            <a routerLink="/properties" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View All ({{ overview()?.recentlyAddedProperties?.length || 0 }})
            </a>
          </div>

          <!-- Zero State if no properties -->
          <div *ngIf="!overview()?.recentlyAddedProperties?.length" class="text-center py-10 space-y-3">
            <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">No properties in portfolio yet</h4>
            <p class="text-xs text-slate-500 max-w-xs mx-auto">Start by adding your first residential or commercial investment asset.</p>
            <a routerLink="/properties/add" class="inline-flex px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white">
              + Add Property
            </a>
          </div>

          <!-- Properties List -->
          <div *ngIf="overview()?.recentlyAddedProperties?.length" class="space-y-3">
            <div
              *ngFor="let prop of overview()?.recentlyAddedProperties"
              class="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-sm transition-all"
            >
              <div class="flex items-center space-x-3 min-w-0">
                <img
                  [src]="prop.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'"
                  class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  alt="Property"
                />
                <div class="min-w-0">
                  <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ prop.name }}</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">{{ prop.city }}, {{ prop.state }} · {{ prop.type }}</p>
                </div>
              </div>

              <div class="text-right flex-shrink-0 pl-3">
                <p class="text-xs font-extrabold text-slate-900 dark:text-white">{{ prop.currentValuation | inrCurrency:'compact' }}</p>
                <span
                  class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded"
                  [ngClass]="{
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300': prop.status === 'RENTED',
                    'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300': prop.status === 'OWNED',
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300': prop.status === 'VACANT'
                  }"
                >
                  {{ prop.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Ledger Transactions -->
        <div class="lg:col-span-5 bg-white dark:bg-[#14213D] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-bold text-slate-900 dark:text-white font-heading">Recent Ledger Transactions</h3>
            <a routerLink="/transactions" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Full Ledger →
            </a>
          </div>

          <div *ngIf="!overview()?.recentTransactions?.length" class="text-center py-10 text-xs text-slate-400">
            No transactions recorded.
          </div>

          <div *ngIf="overview()?.recentTransactions?.length" class="space-y-3">
            <div
              *ngFor="let tx of overview()?.recentTransactions"
              class="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
            >
              <div class="flex items-center space-x-3 min-w-0">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  [ngClass]="{
                    'bg-emerald-100 dark:bg-emerald-950 text-emerald-600': tx.type.includes('INCOME'),
                    'bg-rose-100 dark:bg-rose-950 text-rose-600': tx.type.includes('EXPENSE') || tx.type.includes('TAX'),
                    'bg-indigo-100 dark:bg-indigo-950 text-indigo-600': tx.type.includes('LOAN') || tx.type.includes('PURCHASE')
                  }"
                >
                  <svg *ngIf="tx.type.includes('INCOME')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                  </svg>
                  <svg *ngIf="!tx.type.includes('INCOME')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                </div>
                <div class="min-w-0 truncate">
                  <p class="font-bold text-slate-900 dark:text-white truncate">{{ tx.description }}</p>
                  <p class="text-[10px] text-slate-400">{{ tx.date | date:'dd MMM yyyy' }} · {{ tx.paymentMethod || 'Transfer' }}</p>
                </div>
              </div>

              <span
                class="font-extrabold whitespace-nowrap pl-2"
                [ngClass]="tx.type.includes('INCOME') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'"
              >
                {{ tx.type.includes('INCOME') ? '+' : '-' }}{{ tx.amount | inrCurrency }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('growthChartCanvas') growthChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('distributionChartCanvas') distributionChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cashflowChartCanvas') cashflowChartCanvas!: ElementRef<HTMLCanvasElement>;

  overview = signal<DashboardOverview | null>(null);
  loading = signal<boolean>(true);
  backendError = signal<boolean>(false);

  private growthChart?: Chart;
  private distributionChart?: Chart;
  private cashflowChart?: Chart;

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.overview()) {
      this.initCharts();
    }
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  loadData(): void {
    this.loading.set(true);
    this.backendError.set(false);

    this.apiService.getDashboardOverview().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.overview.set(res.data);
          setTimeout(() => this.initCharts(), 50);
        }
      },
      error: () => {
        this.loading.set(false);
        this.backendError.set(true);
        // Fallback demo state to prevent screen break when postgres service is offline
        this.overview.set(this.getFallbackDemoOverview());
        setTimeout(() => this.initCharts(), 50);
      },
    });
  }

  private initCharts(): void {
    const data = this.overview();
    if (!data) return;

    this.destroyCharts();

    // 1. Growth Line Chart
    if (this.growthChartCanvas?.nativeElement) {
      const trend = data.charts.portfolioGrowthTrend || [];
      this.growthChart = new Chart(this.growthChartCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: trend.map((t) => t.label),
          datasets: [
            {
              label: 'Current Valuation (₹)',
              data: trend.map((t) => t.valuation),
              borderColor: '#2563EB',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              fill: true,
              tension: 0.35,
              borderWidth: 3,
            },
            {
              label: 'Invested Capital (₹)',
              data: trend.map((t) => t.invested),
              borderColor: '#94A3B8',
              borderDash: [5, 5],
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          scales: {
            y: {
              ticks: {
                callback: (val) => `₹ ${(Number(val) / 10000000).toFixed(1)} Cr`,
              },
            },
          },
        },
      });
    }

    // 2. Asset Allocation Doughnut Chart
    if (this.distributionChartCanvas?.nativeElement) {
      const dist = data.charts.propertyDistribution || [];
      this.distributionChart = new Chart(this.distributionChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: dist.map((d) => d.type.replace('_', ' ')),
          datasets: [
            {
              data: dist.map((d) => d.percentage),
              backgroundColor: ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }

    // 3. Cash Flow Bar Chart
    if (this.cashflowChartCanvas?.nativeElement) {
      const flow = data.charts.monthlyCashFlow || [];
      this.cashflowChart = new Chart(this.cashflowChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: flow.map((f) => f.month),
          datasets: [
            {
              label: 'Rental Income (₹)',
              data: flow.map((f) => f.income),
              backgroundColor: '#10B981',
              borderRadius: 6,
            },
            {
              label: 'Operating Expenses (₹)',
              data: flow.map((f) => f.expense),
              backgroundColor: '#EF4444',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
        },
      });
    }
  }

  private destroyCharts(): void {
    this.growthChart?.destroy();
    this.distributionChart?.destroy();
    this.cashflowChart?.destroy();
  }

  private getFallbackDemoOverview(): DashboardOverview {
    return {
      kpis: {
        totalPortfolioValue: 198900000,
        totalInvestment: 156300000,
        unrealizedGain: 42600000,
        totalRentalIncome: 306000,
        totalExpenses: 79200,
        netProfit: 226800,
        averageRoi: 27.26,
        propertyCount: 5,
        occupancyRate: 80.0,
        occupiedCount: 4,
        vacantCount: 1,
      },
      charts: {
        portfolioGrowthTrend: [
          { label: '2022', invested: 62520000, valuation: 70335000 },
          { label: '2023', invested: 101595000, valuation: 118788000 },
          { label: '2024', invested: 132855000, valuation: 164115000 },
          { label: '2025', invested: 148485000, valuation: 184434000 },
          { label: '2026', invested: 156300000, valuation: 198900000 },
        ],
        propertyDistribution: [
          { type: 'RESIDENTIAL', count: 3, value: 124900000, percentage: 62.8 },
          { type: 'COMMERCIAL', count: 1, value: 51000000, percentage: 25.6 },
          { type: 'COMMERCIAL_PLOT', count: 1, value: 23000000, percentage: 11.6 },
        ],
        monthlyCashFlow: [
          { month: 'Jun 2026', income: 306000, expense: 74200, net: 231800 },
          { month: 'Jul 2026', income: 306000, expense: 81000, net: 225000 },
          { month: 'Aug 2026', income: 306000, expense: 88700, net: 217300 },
          { month: 'Sep 2026', income: 306000, expense: 76000, net: 230000 },
          { month: 'Oct 2026', income: 306000, expense: 79200, net: 226800 },
          { month: 'Nov 2026', income: 306000, expense: 79200, net: 226800 },
        ],
      },
      recentlyAddedProperties: [
        {
          id: 'p1',
          userId: 'u1',
          name: 'Prestige Tech Park Residency 3BHK',
          type: 'RESIDENTIAL',
          address: 'ECC Road, Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560066',
          purchasePrice: 14500000,
          currentValuation: 18500000,
          area: 1850,
          areaUnit: 'SQFT',
          purchaseDate: '2022-03-15',
          status: 'RENTED',
          monthlyRentalIncome: 58000,
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        },
        {
          id: 'p2',
          userId: 'u1',
          name: 'One BKC Grade-A Corporate Suite',
          type: 'COMMERCIAL',
          address: 'Bandra Kurla Complex',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400051',
          purchasePrice: 42000000,
          currentValuation: 51000000,
          area: 1400,
          areaUnit: 'SQFT',
          purchaseDate: '2021-08-10',
          status: 'RENTED',
          monthlyRentalIncome: 220000,
          imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        },
        {
          id: 'p3',
          userId: 'u1',
          name: 'DLF Magnolias Luxury Duplex',
          type: 'RESIDENTIAL',
          address: 'Golf Course Road',
          city: 'Gurugram',
          state: 'Haryana',
          pinCode: '122002',
          purchasePrice: 75000000,
          currentValuation: 98000000,
          area: 4200,
          areaUnit: 'SQFT',
          purchaseDate: '2020-11-20',
          status: 'OWNED',
          monthlyRentalIncome: 0,
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        },
      ],
      recentTransactions: [
        {
          id: 'tx1',
          userId: 'u1',
          type: 'RENTAL_INCOME',
          amount: 220000,
          date: '2026-11-01',
          description: 'Nov Rent Credited - FinEdge Capital BKC',
          paymentMethod: 'RTGS',
        },
        {
          id: 'tx2',
          userId: 'u1',
          type: 'LOAN_PAYMENT',
          amount: 78103,
          date: '2026-10-10',
          description: 'HDFC Home Loan Auto-Debit',
          paymentMethod: 'Auto Debit NACH',
        },
        {
          id: 'tx3',
          userId: 'u1',
          type: 'RENTAL_INCOME',
          amount: 58000,
          date: '2026-10-05',
          description: 'Oct Rent Credited - Arjun Sengupta',
          paymentMethod: 'UPI',
        },
      ],
      upcomingLoans: [
        { id: 'l1', propertyName: 'Prestige Tech Park Residency', bankName: 'HDFC Bank Ltd', emiAmount: 78103, outstandingBalance: 8140000 },
        { id: 'l2', propertyName: 'One BKC Corporate Suite', bankName: 'ICICI Bank', emiAmount: 205273, outstandingBalance: 16250000 },
      ],
      recentNotifications: [
        { id: 'n1', userId: 'u1', title: 'Rental Payment Credited', message: '₹2,20,000 received for One BKC Corporate Suite', type: 'SUCCESS', isRead: false, createdAt: '2026-11-01' },
        { id: 'n2', userId: 'u1', title: 'Upcoming EMI Auto-Debit', message: 'HDFC Home Loan EMI of ₹78,103 scheduled for 10th Nov', type: 'WARNING', isRead: false, createdAt: '2026-11-02' },
      ],
    };
  }
}
