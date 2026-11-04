import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  // 1. Public Routes
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },

  // 2. Protected Application Shell Routes (Wrapped in LayoutComponent)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'properties',
        loadComponent: () => import('./pages/properties/property-list.component').then(m => m.PropertyListComponent),
      },
      {
        path: 'properties/add',
        loadComponent: () => import('./pages/properties/property-form.component').then(m => m.PropertyFormComponent),
      },
      {
        path: 'properties/edit/:id',
        loadComponent: () => import('./pages/properties/property-form.component').then(m => m.PropertyFormComponent),
      },
      {
        path: 'properties/:id',
        loadComponent: () => import('./pages/properties/property-detail.component').then(m => m.PropertyDetailComponent),
      },
      {
        path: 'comparison',
        loadComponent: () => import('./pages/comparison/comparison.component').then(m => m.ComparisonComponent),
      },
      {
        path: 'marketplace',
        loadComponent: () => import('./pages/marketplace/marketplace.component').then(m => m.MarketplaceComponent),
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
      },
      {
        path: 'finance',
        loadComponent: () => import('./pages/finance/finance.component').then(m => m.FinanceComponent),
      },
      {
        path: 'rentals',
        loadComponent: () => import('./pages/rentals/rentals.component').then(m => m.RentalsComponent),
      },
      {
        path: 'loans',
        loadComponent: () => import('./pages/loans/loans.component').then(m => m.LoansComponent),
      },
      {
        path: 'transactions',
        loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent),
      },
      {
        path: 'watchlist',
        loadComponent: () => import('./pages/watchlist/watchlist.component').then(m => m.WatchlistComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
      },
    ],
  },

  // 3. Catch-all 404 Route
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
