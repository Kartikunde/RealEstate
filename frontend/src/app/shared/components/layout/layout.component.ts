import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { ToastContainerComponent } from '../toast-container/toast-container.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastContainerComponent],
  template: `
    <div class="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0B1120] text-[#1E293B] dark:text-[#F8FAFC]">
      <!-- Toast Container -->
      <app-toast-container></app-toast-container>

      <!-- Mobile Backdrop -->
      <div
        *ngIf="mobileMenuOpen()"
        (click)="mobileMenuOpen.set(false)"
        class="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
      ></div>

      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-[#14213D] text-white border-r border-slate-800 shadow-xl lg:shadow-none"
        [ngClass]="[
          mobileMenuOpen() ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
          sidebarCollapsed() ? 'lg:w-20' : 'lg:w-64'
        ]"
      >
        <!-- Brand Header -->
        <div class="h-16 flex items-center px-4 border-b border-white/10 justify-between">
          <a routerLink="/dashboard" (click)="mobileMenuOpen.set(false)" class="flex items-center space-x-3 overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="flex flex-col">
              <span class="text-xl font-bold tracking-tight text-white font-heading leading-tight">PropVest</span>
              <span class="text-[10px] tracking-widest text-emerald-400 font-bold uppercase">PORTFOLIO SAAS</span>
            </div>
          </a>

          <!-- Collapse Toggle Button (Desktop only) -->
          <button
            (click)="toggleSidebar()"
            class="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Toggle sidebar"
          >
            <svg class="w-5 h-5 transition-transform" [ngClass]="{'rotate-180': sidebarCollapsed()}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            </svg>
          </button>

          <!-- Mobile Close Button -->
          <button
            (click)="mobileMenuOpen.set(false)"
            class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Portfolio Management
          </div>

          <!-- Dashboard -->
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Dashboard' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Dashboard</span>
          </a>

          <!-- My Properties -->
          <a
            routerLink="/properties"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'My Properties' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">My Properties</span>
          </a>

          <!-- Marketplace -->
          <a
            routerLink="/marketplace"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Marketplace' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Marketplace</span>
          </a>

          <!-- Investment Analytics -->
          <a
            routerLink="/analytics"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Investment Analytics' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Investment Analytics</span>
          </a>

          <!-- Property Comparison -->
          <a
            routerLink="/comparison"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Property Comparison' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Property Comparison</span>
          </a>

          <div *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="pt-3 px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Financials & Operations
          </div>

          <!-- Financial Management -->
          <a
            routerLink="/finance"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Financial Management' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Financial Management</span>
          </a>

          <!-- Rental Management -->
          <a
            routerLink="/rentals"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Rental Management' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Rental Management</span>
          </a>

          <!-- Loans & EMI -->
          <a
            routerLink="/loans"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Loans & EMI' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Loans & EMI</span>
          </a>

          <!-- Transactions -->
          <a
            routerLink="/transactions"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Transactions' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Transactions</span>
          </a>

          <!-- Watchlist -->
          <a
            routerLink="/watchlist"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Watchlist' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Watchlist</span>
          </a>

          <!-- Reports & Documents -->
          <a
            routerLink="/reports"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Reports' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Reports</span>
          </a>

          <!-- Notifications -->
          <a
            routerLink="/notifications"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group relative"
            [title]="sidebarCollapsed() ? 'Notifications' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Notifications</span>
            <span
              *ngIf="unreadCount() > 0"
              class="ml-auto bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            >
              {{ unreadCount() }}
            </span>
          </a>

          <!-- Settings -->
          <a
            routerLink="/settings"
            routerLinkActive="bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
            [title]="sidebarCollapsed() ? 'Settings' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Settings</span>
          </a>

          <!-- Admin Section (Only for Admin) -->
          <div *ngIf="authService.isAdmin()" class="pt-3">
            <div *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="px-3 pb-1 text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
              Administration
            </div>
            <a
              routerLink="/admin"
              routerLinkActive="bg-amber-600 text-white font-medium shadow-md shadow-amber-500/20"
              (click)="mobileMenuOpen.set(false)"
              class="flex items-center px-3 py-2.5 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 transition-colors group"
              [title]="sidebarCollapsed() ? 'Admin Dashboard' : ''"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm">Admin Dashboard</span>
            </a>
          </div>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-3 border-t border-white/10 space-y-1">
          <a
            routerLink="/profile"
            (click)="mobileMenuOpen.set(false)"
            class="flex items-center px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <img
              [src]="authService.currentUser()?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=2563EB&color=fff'"
              class="w-8 h-8 rounded-full border border-white/20 flex-shrink-0 object-cover"
              alt="Avatar"
            />
            <div *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 truncate">
              <p class="text-xs font-semibold text-white truncate">{{ authService.currentUser()?.name || 'Investor' }}</p>
              <p class="text-[10px] text-slate-400 truncate">{{ authService.currentUser()?.email }}</p>
            </div>
          </a>

          <button
            (click)="authService.logout()"
            class="w-full flex items-center px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span *ngIf="!sidebarCollapsed() || mobileMenuOpen()" class="ml-3 text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div
        class="flex-1 flex flex-col min-w-0 transition-all duration-300"
        [ngClass]="sidebarCollapsed() ? 'lg:ml-20' : 'lg:ml-64'"
      >
        <!-- Top Header Bar -->
        <header class="h-16 sticky top-0 z-30 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
          <!-- Mobile Menu Toggle Button & Page Header -->
          <div class="flex items-center space-x-3">
            <button
              (click)="mobileMenuOpen.set(true)"
              class="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <span class="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Live INR (₹)
            </span>
            <button
              (click)="toggleDemoMode()"
              class="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all"
              [ngClass]="demoMode() ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'"
              title="Toggle Demo Mode for evaluator presentation"
            >
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" [ngClass]="demoMode() ? 'bg-amber-500' : 'bg-slate-400'"></span>
              DEMO DATA: {{ demoMode() ? 'ON' : 'OFF' }}
            </button>
          </div>

          <!-- Header Center Search Field -->
          <div class="hidden md:flex flex-1 max-w-md mx-6">
            <div class="relative w-full">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search properties, tenants, transactions..."
                class="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <!-- Top Right Controls -->
          <div class="flex items-center space-x-2 sm:space-x-3">
            <!-- Add Property Button -->
            <a
              routerLink="/properties/add"
              class="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all shadow-blue-500/20"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Property
            </a>

            <!-- Dark Mode Toggle -->
            <button
              (click)="toggleTheme()"
              class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              <svg *ngIf="!isDarkMode()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
              <svg *ngIf="isDarkMode()" class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </button>

            <!-- Notifications Icon Button -->
            <a
              routerLink="/notifications"
              class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span
                *ngIf="unreadCount() > 0"
                class="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"
              ></span>
            </a>

            <!-- User Menu Avatar with Dropdown -->
            <div class="relative">
              <button
                (click)="toggleProfileMenu()"
                class="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800 focus:outline-none"
              >
                <img
                  [src]="authService.currentUser()?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=2563EB&color=fff'"
                  class="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 object-cover"
                  alt="Avatar"
                />
                <span class="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {{ authService.currentUser()?.name || 'Investor' }}
                </span>
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Profile Dropdown Popup -->
              <div
                *ngIf="profileMenuOpen()"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60">
                  <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ authService.currentUser()?.name }}</p>
                  <p class="text-[10px] text-slate-500 truncate">{{ authService.currentUser()?.email }}</p>
                </div>
                <a
                  routerLink="/profile"
                  (click)="profileMenuOpen.set(false)"
                  class="flex items-center px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  My Profile
                </a>
                <a
                  routerLink="/settings"
                  (click)="profileMenuOpen.set(false)"
                  class="flex items-center px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Settings
                </a>
                <button
                  (click)="profileMenuOpen.set(false); authService.logout()"
                  class="w-full text-left flex items-center px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- College Demo Mode Notice Banner -->
        <div
          *ngIf="demoMode()"
          class="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300"
        >
          <div class="flex items-center space-x-2">
            <span class="font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded text-[10px]">Evaluation Showcase</span>
            <span>Demo Mode Active: Sample Indian Real Estate Portfolio data rendered for demonstration & viva defense.</span>
          </div>
          <button (click)="demoMode.set(false)" class="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline">
            Dismiss
          </button>
        </div>

        <!-- Dynamic Page View Outlet -->
        <main class="flex-1 p-4 sm:p-6 md:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class LayoutComponent implements OnInit {
  sidebarCollapsed = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);
  profileMenuOpen = signal<boolean>(false);
  isDarkMode = signal<boolean>(false);
  unreadCount = signal<number>(2);
  demoMode = signal<boolean>(true);

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('propvest_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    }

    this.apiService.getNotifications().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.unreadCount.set(res.data.unreadCount);
        }
      },
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen.update((v) => !v);
  }

  toggleTheme(): void {
    this.isDarkMode.update((v) => !v);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('propvest_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('propvest_theme', 'light');
    }
  }

  toggleDemoMode(): void {
    this.demoMode.update((v) => !v);
  }
}
