import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const propertyCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Property name is required'),
    type: z.enum([
      'RESIDENTIAL',
      'COMMERCIAL',
      'INDUSTRIAL',
      'AGRICULTURAL_LAND',
      'RESIDENTIAL_PLOT',
      'COMMERCIAL_PLOT',
    ]),
    description: z.string().optional(),
    address: z.string().min(2, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pinCode: z.string().min(4, 'PIN code is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    purchasePrice: z.number().positive('Purchase price must be positive'),
    currentValuation: z.number().positive('Current valuation must be positive'),
    area: z.number().positive('Area must be positive'),
    areaUnit: z.enum(['SQFT', 'SQYD', 'ACRE', 'SQM']).default('SQFT'),
    bedrooms: z.number().int().nonnegative().optional(),
    bathrooms: z.number().int().nonnegative().optional(),
    purchaseDate: z.string().or(z.date()),
    status: z.enum(['OWNED', 'RENTED', 'VACANT', 'UNDER_MAINTENANCE', 'SOLD']).default('OWNED'),
    monthlyRentalIncome: z.number().nonnegative().optional(),
    imageUrl: z.string().optional(),
  }),
});

export const financialRecordSchema = z.object({
  body: z.object({
    propertyId: z.string().nullable().optional(),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.enum([
      'RENTAL_INCOME',
      'PROPERTY_SALE',
      'OTHER_INCOME',
      'MAINTENANCE',
      'PROPERTY_TAX',
      'INSURANCE',
      'REPAIRS',
      'SOCIETY_CHARGES',
      'UTILITIES',
      'MANAGEMENT_FEES',
      'OTHER_EXPENSES',
    ]),
    amount: z.number().positive('Amount must be positive'),
    transactionDate: z.string().or(z.date()),
    description: z.string().optional(),
    receiptUrl: z.string().optional(),
  }),
});

export const rentalAgreementSchema = z.object({
  body: z.object({
    propertyId: z.string(),
    tenantName: z.string().min(2, 'Tenant name is required'),
    tenantEmail: z.string().email().optional().or(z.literal('')),
    tenantPhone: z.string().min(5, 'Valid phone number is required'),
    monthlyRent: z.number().positive('Monthly rent must be positive'),
    securityDeposit: z.number().nonnegative().optional().default(0),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    paymentDueDate: z.number().int().min(1).max(31).default(5),
    notes: z.string().optional(),
  }),
});

export const rentalPaymentRecordSchema = z.object({
  body: z.object({
    agreementId: z.string(),
    amount: z.number().positive('Amount must be positive'),
    paymentDate: z.string().or(z.date()),
    paymentMethod: z.string().optional(),
    notes: z.string().optional(),
    receiptUrl: z.string().optional(),
  }),
});

export const loanSchema = z.object({
  body: z.object({
    propertyId: z.string(),
    bankName: z.string().min(2, 'Bank name is required'),
    principalAmount: z.number().positive('Principal amount must be positive'),
    interestRate: z.number().positive('Interest rate must be positive'),
    tenureMonths: z.number().int().positive('Tenure in months must be positive'),
    startDate: z.string().or(z.date()),
    notes: z.string().optional(),
  }),
});

export const marketplaceInquirySchema = z.object({
  body: z.object({
    listingId: z.string(),
    userName: z.string().min(2, 'Name is required'),
    userEmail: z.string().email('Valid email is required'),
    userPhone: z.string().min(6, 'Valid phone number is required'),
    message: z.string().min(5, 'Message must be at least 5 characters'),
  }),
});
