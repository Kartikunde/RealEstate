# PropVest Platform - Complete Project Structure & Architecture

## Overview
**PropVest** is a full-stack Real Estate Investment & Property Portfolio Management Platform built with Angular (Frontend), Node.js / Express (Backend REST API), and PostgreSQL with Prisma ORM.

---

## Directory Tree

```
RealEstate/
├── README.md                           # Master project guide, credentials & setup documentation
├── PROPVEST_PROJECT_AUDIT.md           # Full-stack audit report (95% completion score)
├── PROJECT_STRUCTURE.md                # Complete architectural layout & component index
├── start-all.ps1                       # Master one-click startup script (Launches backend & frontend)
├── start-backend.ps1                   # Starts Node.js Express API on port 5000
├── start-frontend.ps1                  # Starts Angular SaaS Frontend on port 4200
├── setup-database.ps1                  # PostgreSQL migration & Indian demo data seed script
│
├── backend/                            # Node.js + Express + TypeScript Backend API
│   ├── .env.example                    # Sanitized environment variable template
│   ├── package.json                    # Backend dependencies & npm scripts
│   ├── tsconfig.json                   # TypeScript compiler configuration
│   │
│   ├── prisma/
│   │   ├── schema.prisma               # Complete relational data model (11 models, 7 enums)
│   │   └── seed.ts                     # High-fidelity Indian real estate seed script
│   │
│   └── src/
│       ├── server.ts                   # Application entrypoint & HTTP listener (Port 5000)
│       ├── app.ts                      # Express app setup, CORS, JSON parsing, error handling
│       │
│       ├── config/
│       │   └── db.ts                   # PrismaClient instance & database connection lifecycle
│       │
│       ├── controllers/
│       │   ├── auth.controller.ts      # Register, login, profile, password change & demo fallback
│       │   ├── property.controller.ts  # CRUD, valuation updates, metrics calculation & filtering
│       │   ├── financial.controller.ts # Monthly cash flow, income/expense records & analytics
│       │   ├── loan.controller.ts      # Mortgage loans, live EMI calculations & prepayment schedules
│       │   ├── rental.controller.ts    # Tenancy leases, rent collection logs & overdue tracking
│       │   ├── marketplace.controller.ts# Pre-leased institutional investment discovery
│       │   ├── transaction.controller.ts# Consolidated transaction ledger & CSV exporter
│       │   ├── document.controller.ts  # Document vault storage & certified legal PDF generation
│       │   ├── report.controller.ts    # Auditor-ready PDF & CSV report generators (pdfkit)
│       │   ├── notification.controller.ts# User notification feed & unread counter
│       │   ├── user.controller.ts      # User management & account settings
│       │   └── admin.controller.ts     # Platform telemetry, user registry & listing approvals
│       │
│       ├── routes/
│       │   ├── auth.routes.ts          # /api/auth
│       │   ├── property.routes.ts      # /api/properties
│       │   ├── financial.routes.ts     # /api/financials
│       │   ├── loan.routes.ts          # /api/loans
│       │   ├── rental.routes.ts        # /api/rentals
│       │   ├── marketplace.routes.ts   # /api/marketplace
│       │   ├── transaction.routes.ts   # /api/transactions
│       │   ├── document.routes.ts      # /api/documents
│       │   ├── report.routes.ts        # /api/reports
│       │   ├── notification.routes.ts  # /api/notifications
│       │   ├── user.routes.ts          # /api/users
│       │   ├── admin.routes.ts         # /api/admin
│       │   └── index.ts                # Master API router aggregator
│       │
│       ├── middleware/
│       │   ├── auth.middleware.ts      # JWT authentication, demo tokens & admin authorization
│       │   ├── validate.middleware.ts  # Zod request validation middleware
│       │   ├── upload.middleware.ts    # Multer file upload handler
│       │   └── error.middleware.ts     # Global centralized error handler
│       │
│       └── utils/
│           ├── calculator.ts           # Financial formulas (ROI, Cap Rate, Gross/Net Yield, IRR, EMI)
│           └── pdfGenerator.ts         # PDFKit branded statement & certified deed engine
│
└── frontend/                           # Angular Latest Stable + TypeScript Frontend
    ├── angular.json                    # Angular CLI project configuration
    ├── package.json                    # Frontend dependencies (Angular, Tailwind, Chart.js)
    ├── tsconfig.json                   # TypeScript configuration
    ├── tsconfig.app.json               # App-specific TS options
    │
    ├── public/                         # Static assets & public icons
    │
    └── src/
        ├── index.html                  # HTML5 host document with Inter & Plus Jakarta Sans
        ├── main.ts                     # Angular standalone application bootstrap
        ├── styles.css                  # Global Tailwind CSS directives & FinTech themes
        │
        └── app/
            ├── app.config.ts           # Standalone providers (Router, HttpClient, Animations)
            ├── app.routes.ts           # 22 Standalone application routes with Auth & Admin guards
            ├── app.component.ts        # Root shell component
            │
            ├── core/                   # Core singleton services, models & guards
            │   ├── guards/
            │   │   ├── auth.guard.ts   # Protects authenticated portfolio pages
            │   │   └── admin.guard.ts  # Restricts /admin route to ADMIN role
            │   │
            │   ├── interceptors/
            │   │   └── auth.interceptor.ts # Attaches Bearer JWT & handles 401 redirection
            │   │
            │   ├── models/
            │   │   └── index.ts        # TypeScript interfaces for all real estate & financial entities
            │   │
            │   └── services/
            │       ├── api.service.ts  # Master typed REST client for all 13 backend resource domains
            │       ├── auth.service.ts # State signals for authentication, JWT storage & current user
            │       └── toast.service.ts# Modern reactive notifications (Success, Error, Info)
            │
            ├── shared/                 # Shared UI components & pipes
            │   ├── components/
            │   │   ├── layout/         # Persistent app shell, sidebar navigation & demo banner
            │   │   └── toast/          # Floating toast notification container
            │   └── pipes/
            │       └── inr-currency.pipe.ts # Custom pipe formatting INR currency (Lakhs & Crores)
            │
            └── pages/                  # 22 Standalone View Components
                ├── landing/            # High-conversion FinTech landing page
                ├── auth/
                │   ├── login/          # Sign-in with quick-fill demo credentials
                │   ├── register/       # User onboarding form
                │   └── forgot-password/# Self-service password reset
                ├── dashboard/          # Portfolio KPI metrics & Chart.js cash-flow graphs
                ├── properties/
                │   ├── property-list.component.ts   # Grid/Table portfolio browser with filtering
                │   ├── property-form.component.ts   # Multi-step property acquisition wizard
                │   └── property-detail.component.ts # Comprehensive property dossier & metrics
                ├── marketplace/        # Pre-leased institutional deal discovery & IRR models
                ├── comparison/         # 4-Property side-by-side benchmark matrix
                ├── analytics/          # Advanced IRR, Cap Rate & asset class distribution
                ├── finance/            # Cash flow timeline & operational expense breakdown
                ├── rentals/            # Tenancy leases, rent receipts & occupancy trackers
                ├── loans/              # Live interactive mortgage EMI & amortization simulator
                ├── transactions/       # Itemized transaction ledger with search & CSV export
                ├── watchlist/          # Monitored prospective real estate assets
                ├── reports/            # Auditor-ready PDF/CSV report generation & Document Vault
                ├── notifications/      # Real-time alert feed & activity stream
                ├── profile/            # User investor credentials & KYC status
                ├── settings/           # Preferences, currency (INR) & security controls
                ├── admin/              # Platform monitoring, user registry & listing approvals
                └── not-found/          # Branded 404 error page
```

---

## REST API Summary

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/register` | Register new user account |
| **Auth** | POST | `/api/auth/login` | Login with credentials & get JWT |
| **Auth** | GET | `/api/auth/me` | Fetch authenticated user profile |
| **Properties** | GET | `/api/properties` | List user properties with filters |
| **Properties** | POST | `/api/properties` | Add new property |
| **Properties** | GET | `/api/properties/:id` | Get property details & metrics |
| **Properties** | PUT | `/api/properties/:id` | Update property |
| **Properties** | DELETE| `/api/properties/:id` | Remove property |
| **Marketplace** | GET | `/api/marketplace` | List investment opportunities |
| **Financials** | GET | `/api/financials/dashboard` | KPI totals & 6-month cash flow |
| **Loans** | GET | `/api/loans` | List mortgages & total debt |
| **Rentals** | GET | `/api/rentals` | List tenancy agreements & dues |
| **Transactions** | GET | `/api/transactions` | Filterable transaction ledger |
| **Transactions** | GET | `/api/transactions/export/csv` | Download transactions CSV |
| **Reports** | GET | `/api/reports/portfolio` | Download Portfolio PDF/CSV |
| **Reports** | GET | `/api/reports/rentals` | Download Rental Statement PDF/CSV |
| **Reports** | GET | `/api/reports/expenses` | Download Expense Audit PDF/CSV |
| **Reports** | GET | `/api/reports/loans` | Download Loan Schedule PDF/CSV |
| **Documents** | GET | `/api/documents/:id/download` | Download Certified Legal PDF Deed |
| **Admin** | GET | `/api/admin/stats` | Platform telemetry & stats |
