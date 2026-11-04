"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketplaceInquirySchema = exports.loanSchema = exports.rentalPaymentRecordSchema = exports.rentalAgreementSchema = exports.financialRecordSchema = exports.propertyCreateSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        phone: zod_1.z.string().optional(),
        role: zod_1.z.enum(['USER', 'ADMIN']).optional(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, 'Current password is required'),
        newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters'),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
    }),
});
exports.propertyCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Property name is required'),
        type: zod_1.z.enum([
            'RESIDENTIAL',
            'COMMERCIAL',
            'INDUSTRIAL',
            'AGRICULTURAL_LAND',
            'RESIDENTIAL_PLOT',
            'COMMERCIAL_PLOT',
        ]),
        description: zod_1.z.string().optional(),
        address: zod_1.z.string().min(2, 'Address is required'),
        city: zod_1.z.string().min(2, 'City is required'),
        state: zod_1.z.string().min(2, 'State is required'),
        pinCode: zod_1.z.string().min(4, 'PIN code is required'),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        purchasePrice: zod_1.z.number().positive('Purchase price must be positive'),
        currentValuation: zod_1.z.number().positive('Current valuation must be positive'),
        area: zod_1.z.number().positive('Area must be positive'),
        areaUnit: zod_1.z.enum(['SQFT', 'SQYD', 'ACRE', 'SQM']).default('SQFT'),
        bedrooms: zod_1.z.number().int().nonnegative().optional(),
        bathrooms: zod_1.z.number().int().nonnegative().optional(),
        purchaseDate: zod_1.z.string().or(zod_1.z.date()),
        status: zod_1.z.enum(['OWNED', 'RENTED', 'VACANT', 'UNDER_MAINTENANCE', 'SOLD']).default('OWNED'),
        monthlyRentalIncome: zod_1.z.number().nonnegative().optional(),
        imageUrl: zod_1.z.string().optional(),
    }),
});
exports.financialRecordSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string().nullable().optional(),
        type: zod_1.z.enum(['INCOME', 'EXPENSE']),
        category: zod_1.z.enum([
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
        amount: zod_1.z.number().positive('Amount must be positive'),
        transactionDate: zod_1.z.string().or(zod_1.z.date()),
        description: zod_1.z.string().optional(),
        receiptUrl: zod_1.z.string().optional(),
    }),
});
exports.rentalAgreementSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string(),
        tenantName: zod_1.z.string().min(2, 'Tenant name is required'),
        tenantEmail: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
        tenantPhone: zod_1.z.string().min(5, 'Valid phone number is required'),
        monthlyRent: zod_1.z.number().positive('Monthly rent must be positive'),
        securityDeposit: zod_1.z.number().nonnegative().optional().default(0),
        startDate: zod_1.z.string().or(zod_1.z.date()),
        endDate: zod_1.z.string().or(zod_1.z.date()),
        paymentDueDate: zod_1.z.number().int().min(1).max(31).default(5),
        notes: zod_1.z.string().optional(),
    }),
});
exports.rentalPaymentRecordSchema = zod_1.z.object({
    body: zod_1.z.object({
        agreementId: zod_1.z.string(),
        amount: zod_1.z.number().positive('Amount must be positive'),
        paymentDate: zod_1.z.string().or(zod_1.z.date()),
        paymentMethod: zod_1.z.string().optional(),
        notes: zod_1.z.string().optional(),
        receiptUrl: zod_1.z.string().optional(),
    }),
});
exports.loanSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string(),
        bankName: zod_1.z.string().min(2, 'Bank name is required'),
        principalAmount: zod_1.z.number().positive('Principal amount must be positive'),
        interestRate: zod_1.z.number().positive('Interest rate must be positive'),
        tenureMonths: zod_1.z.number().int().positive('Tenure in months must be positive'),
        startDate: zod_1.z.string().or(zod_1.z.date()),
        notes: zod_1.z.string().optional(),
    }),
});
exports.marketplaceInquirySchema = zod_1.z.object({
    body: zod_1.z.object({
        listingId: zod_1.z.string(),
        userName: zod_1.z.string().min(2, 'Name is required'),
        userEmail: zod_1.z.string().email('Valid email is required'),
        userPhone: zod_1.z.string().min(6, 'Valid phone number is required'),
        message: zod_1.z.string().min(5, 'Message must be at least 5 characters'),
    }),
});
