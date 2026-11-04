export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string | null;
  createdAt?: string;
  _count?: {
    properties: number;
    financials: number;
    loans: number;
    watchlist: number;
  };
}

export interface Property {
  id: string;
  userId: string;
  name?: string;
  title?: string;
  type: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  pinCode?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  purchasePrice: number;
  currentValuation: number;
  area?: number;
  areaSqFt?: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: string;
  purchaseDate: string | Date;
  status: string;
  monthlyRentalIncome?: number;
  monthlyRent?: number;
  imageUrl?: string;
  agreements?: RentalAgreement[];
  loans?: Loan[];
  financialRecords?: FinancialRecord[];
  documents?: PropertyDocument[];
  transactions?: Transaction[];
  calculatedRoi?: number;
  calculatedGrossYield?: number;
  calculatedCapitalAppreciation?: number;
  calculatedPricePerSqFt?: number;
  metrics?: {
    roi: number;
    grossYield: number;
    netYield: number;
    capitalAppreciation: number;
    annualizedReturn: number;
    pricePerSqFt: number;
    netMonthlyCashFlow: number;
    annualRentalIncome: number;
    totalRecordedExpenses: number;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  type?: string;
  propertyType?: string;
  description: string;
  address?: string;
  location?: string;
  city: string;
  state?: string;
  pinCode?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  area?: number;
  areaSqFt?: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  estimatedRentalIncome?: number;
  monthlyRent?: number;
  estimatedRentalYield?: number;
  rentalYield?: number;
  estimatedAnnualAppreciation?: number;
  imageUrl: string;
  imageGallery?: string[];
  specifications?: Record<string, any>;
  sellerName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  isDemo?: boolean;
  pricePerSqFt?: number;
  tenant?: string;
  isWatchlisted?: boolean;
  createdAt?: string;
}

export interface WatchlistItem {
  id: string;
  userId?: string;
  listingId?: string;
  listing?: MarketplaceListing;
  title?: string;
  propertyType?: string;
  city?: string;
  location?: string;
  price?: number;
  monthlyRent?: number;
  rentalYield?: number;
  areaSqFt?: number;
  tenant?: string;
  imageUrl?: string;
  addedAt?: string | Date;
  createdAt?: string;
}

export interface RentalAgreement {
  id: string;
  propertyId: string;
  tenantName: string;
  tenantEmail?: string;
  tenantPhone?: string;
  tenantContact?: string;
  monthlyRent: number;
  securityDeposit: number;
  startDate: string | Date;
  endDate: string | Date;
  paymentDueDate?: number;
  status?: string;
  isActive?: boolean;
  notes?: string;
  payments?: RentalPayment[];
  propertyName?: string;
  propertyTitle?: string;
  propertyCity?: string;
  propertyImage?: string;
  createdAt?: string | Date;
}

export interface RentalPayment {
  id: string;
  agreementId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paymentDate?: string | null;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIALLY_PAID';
  paymentMethod?: string;
  receiptUrl?: string;
  notes?: string;
  tenantName?: string;
  propertyName?: string;
  createdAt?: string;
}

export interface FinancialRecord {
  id: string;
  userId?: string;
  propertyId?: string | null;
  property?: { id: string; name: string; city: string };
  propertyTitle?: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  transactionDate?: string;
  date?: string | Date;
  description?: string;
  receiptUrl?: string;
  createdAt?: string | Date;
}

export interface Loan {
  id: string;
  userId?: string;
  propertyId: string;
  property?: { id: string; name: string; city: string; currentValuation: number };
  propertyTitle?: string;
  bankName: string;
  accountNumber?: string;
  principalAmount?: number;
  originalAmount?: number;
  interestRate: number;
  tenureMonths: number;
  paidMonths?: number;
  startDate: string | Date;
  emiAmount?: number;
  monthlyEmi?: number;
  outstandingBalance: number;
  totalPayable?: number;
  totalInterest?: number;
  repaidPrincipal?: number;
  progressPercentage?: number;
  status?: string;
  notes?: string;
  emiPayments?: LoanEmiPayment[];
  createdAt?: string | Date;
}

export interface LoanEmiPayment {
  id: string;
  loanId: string;
  paymentDate: string;
  amountPaid: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  status: string;
  notes?: string;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  userId?: string;
  propertyId?: string | null;
  property?: { id: string; name: string; city: string };
  propertyTitle?: string;
  type: string;
  category?: string;
  amount: number;
  date: string | Date;
  description?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  status?: string;
  createdAt?: string | Date;
}

export interface PropertyDocument {
  id: string;
  propertyId?: string;
  property?: { id: string; name: string };
  propertyTitle?: string;
  title: string;
  category: string;
  fileUrl: string;
  fileSize?: string;
  uploadedAt?: string;
  createdAt?: string | Date;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  category?: string;
  isRead: boolean;
  createdAt: string | Date;
}

export interface DashboardOverview {
  kpis: {
    totalPortfolioValue: number;
    totalInvestment: number;
    unrealizedGain: number;
    totalRentalIncome: number;
    totalExpenses: number;
    netProfit: number;
    averageRoi: number;
    propertyCount: number;
    occupancyRate: number;
    occupiedCount: number;
    vacantCount: number;
  };
  charts: {
    propertyDistribution: Array<{ type: string; count: number; value: number; percentage: number }>;
    monthlyCashFlow: Array<{ month: string; income: number; expense: number; net: number }>;
    portfolioGrowthTrend: Array<{ label: string; invested: number; valuation: number }>;
  };
  recentTransactions: Transaction[];
  recentlyAddedProperties: Property[];
  upcomingLoans: Array<{ id: string; propertyName: string; bankName: string; emiAmount: number; outstandingBalance: number }>;
  recentNotifications: Notification[];
}
