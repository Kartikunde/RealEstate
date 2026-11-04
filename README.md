# PropVest – Real Estate Investment & Property Portfolio Management Platform

[![Angular](https://img.shields.io/badge/Angular-22.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.18.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.4-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.19.1-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.6.1-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

---

## 📌 Project Overview

**PropVest** is an enterprise-grade, institutional Real Estate Investment and Property Portfolio Management Platform designed for individual high-net-worth investors, family offices, property managers, and real estate syndicates. 

Tailored specifically for the **Indian Real Estate Market**, PropVest unifies property acquisitions, valuation tracking, tenant lease management, reducing-balance home loan amortizations, municipal tax reserves, and investment yield analytics under a unified FinTech SaaS dashboard formatted in **Indian Rupees (₹ Lakhs & Crores)**.

---

## 🚀 Key Platform Modules & Capabilities

### 1. 📊 Investor Dashboard
- **High-Level KPIs:** Total Portfolio Valuation (₹ Cr), Invested Capital, Total Unrealized Gain, Monthly Rental Income, Total Expenses, Net Cash Flow, and Average Portfolio ROI.
- **Interactive Visualizations:**
  - *Capital Valuation Trajectory:* Historical cost vs current market valuation.
  - *Asset Class Distribution:* Doughnut breakdown across Residential, Commercial, and Industrial.
  - *Cash Flow Dynamics:* Monthly gross rental inflows vs loan EMIs and society maintenance outlays.
- **Portfolio Health Gauge:** Real-time occupancy rate and rent collection status.

### 2. 🏢 My Properties (Portfolio Management)
- Complete CRUD management with card and tabular layout switcher.
- Dynamic search by property title, micro-market, city, or address.
- Filtering by asset category (Residential, Commercial, Industrial, Plots) and occupancy status (Rented, Owned, Vacant, Under Maintenance).
- Valuation sorting (High-Low, Low-High, Yield High-Low).
- Soft deletion with safety confirmation modal.

### 3. 📝 Add & Edit Property Engine
- Four-section reactive form with real-time validation:
  1. *Basic Information:* Asset name, classification category, and description.
  2. *Location & Pincode:* Society address, city, state, and postal code.
  3. *Financials & Valuation:* Acquisition price, current valuation, and monthly rental collection.
  4. *Specifications:* Super built-up area (sq.ft), configuration (BHK), bathrooms, and image URL.

### 4. 🔍 Property Details Dossier
- Comprehensive single-asset financial overview.
- Capital appreciation calculation and CAGR estimation.
- Operating cash flow breakdown: Gross Rent minus Society Maintenance, Property Tax Reserve, and Home Loan EMI.
- Active tenant profile (lease tenure, security deposit held in escrow, payment status).
- Document vault shortcuts for registered sale deeds and tax challans.

### 5. 🛒 Pre-Leased Marketplace
- Curated institutional real estate deals across major Indian metros (Bengaluru, Mumbai MMR, Delhi NCR/Gurugram, Hyderabad, Pune).
- Anchor tenant data (Amazon Fulfillment, Barclays, Cognizant, S&P Global, Axis Bank).
- Gross rental yield filters (Yield > 5%, > 7.5%, > 9%).
- One-click inquiry modal with direct advisory desk routing.
- Watchlist integration.

### 6. ⚖️ Property Comparison Matrix (`/comparison`)
- Side-by-side analytical comparison of up to 4 properties simultaneously.
- Comparison attributes: Purchase price, current valuation, gross rental yield, net yield, monthly rental income, price per sq.ft, projected 5-year CAGR, gross payback horizon, and tenant profile.
- Dual-axis Chart.js visualization comparing asset valuation against rental yield.

### 7. 📈 Investment Analytics & ROI
- Portfolio CAGR calculation outperforming standard Nifty Realty benchmarks.
- Gross vs Net Yield matrix accounting for operational overheads and statutory municipal taxes.
- Portfolio Loan-To-Value (LTV) gearing ratio.
- Time-horizon selector (Monthly, Quarterly, Yearly).

### 8. 💵 Financial Management & Cash Flow
- Complete income and expense transaction ledger.
- Net Operating Income (NOI) calculation.
- Operating Expense Ratio (OER) monitoring.
- "Record Financial Entry" modal supporting categories: Rent, Security Deposit, Society Maintenance, Property Tax, Repairs, Insurance, and Legal Stamp Duty.

### 9. 🔑 Rental & Tenant Management
- Total monthly rent roll and portfolio occupancy percentage.
- Escrow liability tracking for security deposits.
- Active lease agreement registry with lease duration and renewal reminders.
- "Record Rent Collection" modal supporting UPI, NEFT, IMPS, and Cheque payment modes.

### 10. 🏦 Loans, Mortgages & EMI Management
- Aggregate outstanding mortgage liabilities and monthly EMI commitments.
- Blended repo-linked interest rate monitoring.
- Reducing-balance EMI payment tracker with progress bars.
- **Interactive Live EMI Simulator:** Range sliders for Loan Amount (₹10L - ₹5Cr), Interest Rate (6.5% - 14%), and Tenure (5 - 30 Years) with instant EMI and total interest calculations.

### 11. 📜 Unified Transaction Audit Ledger
- Immutable audit log of all financial events with unique Reference Numbers.
- Filtering by transaction type (Credits vs Debits) and search.
- One-click CSV export functionality.

### 12. ❤️ Watchlist
- Shortlist high-yield commercial and residential deals from the marketplace.
- Instant access to deal parameters, tenant locks, and direct advisory inquiry.

### 13. 📑 Reports & 256-Bit Encrypted Document Vault
- **Automated Report Generation:** One-click PDF dossiers and CSV downloads for:
  1. *Portfolio Valuation Dossier*
  2. *Rental Income Statement*
  3. *Operating Expenses & Tax Schedule*
  4. *Loan & EMI Amortization Statement*
- **Document Vault:** Secure storage for Registered Sale Deeds, Khata Extracts, Mutation Certificates, and Lease Agreements.

### 14. 🔔 Notifications & Alerts Feed
- Event-driven notifications for rental receipts, NACH auto-debits, lease renewal warnings, and marketplace deal adjustments.
- Mark as read and "Mark All as Read" capabilities.

### 15. 👤 Investor Profile & System Settings
- KYC verification status badge and PAN Card tax credential recording.
- Password change utility.
- Dark Mode / Light Mode theme toggle.
- Currency and financial number format selector (Lakhs & Crores vs Millions).

### 16. 🛡️ Admin Dashboard (`/admin`)
- Accessible strictly by platform administrators (protected via `AdminGuard`).
- Platform-wide Assets Under Management (AUM) summary.
- Registered investors directory and property holdings count.
- Marketplace deal inventory moderation and instant publishing modal.

### 17. 🟢 Interactive College Demo Mode
- A persistent, dismissible showcase banner and toggle switch (`DEMO DATA: ON / OFF`) in the navigation bar.
- Pre-loaded with realistic Indian real estate assets (Bengaluru apartments, Mumbai luxury homes, Gurugram commercial suites) so that **evaluators can test the entire platform even if the local database service is offline**.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Framework** | Angular 22 (Standalone Components, Signals, Reactive Forms) |
| **Frontend Routing** | Angular Router with Lazy-Loaded Chunks, `AuthGuard`, and `AdminGuard` |
| **UI & Styling** | Tailwind CSS + FinTech Design Palette + Dark / Light Theme System |
| **Data Visualization** | Chart.js 4.6.1 + Canvas Engine |
| **Icons & Pipes** | SVG Icons + Custom `InrCurrencyPipe` (₹ Lakhs & Crores formatting) |
| **Backend Framework** | Node.js (v24) + Express.js (v4) with TypeScript |
| **Authentication** | JWT (`jsonwebtoken`) + BCrypt Password Hashing |
| **Input Validation** | Zod Schemas |
| **Database & ORM** | PostgreSQL 18.4 + Prisma ORM (11 Relational Entities) |
| **Report Generation** | PDFKit + CSV Streaming |

---

## 💻 Installation & Setup Guide

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher
- **PostgreSQL:** (Optional if using Demo Mode; required for live persistent database)

---

### 2. Clone / Open Repository
```bash
cd c:\Users\HP\OneDrive\Desktop\RealEstate
```

---

### 3. Backend Setup
```bash
cd backend
npm install
```

#### Environment Variables (`backend/.env`)
Create or verify the `backend/.env` file:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/propvest_db?schema=public"
JWT_SECRET="propvest_super_secret_jwt_key_2026_fintech"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:4200"
```

#### Database Setup & Seeding (When PostgreSQL is running)
```bash
npx prisma db push
npx prisma generate
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```
*Backend runs on `http://localhost:5000` with health check at `http://localhost:5000/api/health`.*

---

### 4. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm start
```
*Frontend runs on `http://localhost:4200`.*

---

## 🔑 Demo Login Credentials for Evaluation

The login page includes **instant one-click auto-fill buttons** for demo accounts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Investor** | `demo@propvest.in` | `Password123!` | Full portfolio management, properties, marketplace, analytics, loans, finance |
| **Administrator** | `admin@propvest.in` | `Admin123!` | Investor features + Administrator Console (`/admin`), user directory, deal publishing |

---

## ⚡ Quick One-Click Launch Scripts (Windows)

For presentation and evaluation convenience, four PowerShell scripts are provided in the root folder:

- **`./start-all.ps1`**: Launches both backend (port 5000) and frontend (port 4200) in separate terminals simultaneously.
- **`./start-backend.ps1`**: Starts only the backend API server.
- **`./start-frontend.ps1`**: Starts only the Angular frontend application.
- **`./setup-database.ps1`**: Starts PostgreSQL service, applies Prisma schema, and seeds realistic data.

---

## 🏗️ Production Build Verification

Both frontend and backend build cleanly with zero compilation errors:

```powershell
# Frontend Production Build
cd frontend
npm run build
# Result: Application bundle generation complete [Exit Code 0]
# Initial chunk payload: 348 kB | 19 lazy chunks

# Backend TypeScript Build
cd backend
npm run build
# Result: tsc compilation complete [Exit Code 0]
```

---

## 👨‍💻 Academic Project Attribution
- **Project Name:** PropVest – Real Estate Investment & Property Portfolio Management Platform
- **Scope:** Full-Stack Web Application (Frontend + Backend + Database + Analytics)
- **Target Currency:** Indian Rupee (₹ INR)
- **Status:** Complete, Production-Ready, and Fully Demonstrable
