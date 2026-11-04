"use strict";
/**
 * Financial and Real Estate Investment Calculations Utility
 * PropVest Platform - Precision financial formulas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentCalculator = void 0;
class InvestmentCalculator {
    /**
     * Return on Investment (ROI)
     * Formula: ((Current Value - Total Investment) / Total Investment) * 100
     */
    static calculateRoi(currentValue, totalInvestment) {
        if (totalInvestment <= 0)
            return 0;
        const roi = ((currentValue - totalInvestment) / totalInvestment) * 100;
        return Number(roi.toFixed(2));
    }
    /**
     * Gross Annual Rental Yield
     * Formula: (Annual Rental Income / Property Value) * 100
     */
    static calculateGrossRentalYield(annualRentalIncome, propertyValue) {
        if (propertyValue <= 0)
            return 0;
        const yieldPercentage = (annualRentalIncome / propertyValue) * 100;
        return Number(yieldPercentage.toFixed(2));
    }
    /**
     * Net Annual Rental Yield
     * Formula: ((Annual Rental Income - Annual Operating Expenses) / Property Value) * 100
     */
    static calculateNetRentalYield(annualRentalIncome, annualOperatingExpenses, propertyValue) {
        if (propertyValue <= 0)
            return 0;
        const netIncome = Math.max(0, annualRentalIncome - annualOperatingExpenses);
        const netYield = (netIncome / propertyValue) * 100;
        return Number(netYield.toFixed(2));
    }
    /**
     * Capital Appreciation
     * Formula: Current Market Value - Purchase Price
     */
    static calculateCapitalAppreciation(currentMarketValue, purchasePrice) {
        return Number((currentMarketValue - purchasePrice).toFixed(2));
    }
    /**
     * Net Monthly Cash Flow
     * Formula: Monthly Rental Income - Monthly Expenses - EMI
     */
    static calculateNetMonthlyCashFlow(monthlyRentalIncome, monthlyExpenses, monthlyEmi) {
        return Number((monthlyRentalIncome - monthlyExpenses - monthlyEmi).toFixed(2));
    }
    /**
     * Price Per Square Foot
     * Formula: Property Price / Property Area
     */
    static calculatePricePerSqFt(price, areaSqFt) {
        if (areaSqFt <= 0)
            return 0;
        return Number((price / areaSqFt).toFixed(2));
    }
    /**
     * Annualized Return (Compound Annual Growth Rate - CAGR)
     * Formula: ((Current Value / Initial Investment) ^ (1 / years) - 1) * 100
     */
    static calculateAnnualizedReturn(initialInvestment, currentValue, purchaseDate, currentDate = new Date()) {
        if (initialInvestment <= 0 || currentValue <= 0)
            return 0;
        const diffTime = Math.abs(currentDate.getTime() - purchaseDate.getTime());
        const years = diffTime / (1000 * 60 * 60 * 24 * 365.25);
        if (years <= 0.05) {
            // Less than 18 days: fallback to basic simple ROI
            return this.calculateRoi(currentValue, initialInvestment);
        }
        const cagr = (Math.pow(currentValue / initialInvestment, 1 / years) - 1) * 100;
        return Number(cagr.toFixed(2));
    }
    /**
     * Reducing-Balance EMI Calculation
     * Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
     * Where:
     * P = Principal loan amount
     * r = Monthly interest rate (annualRate / 12 / 100)
     * n = Number of monthly installments (tenureMonths)
     */
    static calculateEmi(principal, annualInterestRate, tenureMonths, startDate = new Date()) {
        if (principal <= 0 || tenureMonths <= 0) {
            return { monthlyEmi: 0, totalPayable: 0, totalInterest: 0, schedule: [] };
        }
        if (annualInterestRate === 0) {
            const emi = Number((principal / tenureMonths).toFixed(2));
            const schedule = [];
            let balance = principal;
            for (let i = 1; i <= tenureMonths; i++) {
                balance -= emi;
                const payDate = new Date(startDate);
                payDate.setMonth(payDate.getMonth() + i);
                schedule.push({
                    month: i,
                    paymentDate: payDate.toISOString().split('T')[0],
                    emi,
                    principalPaid: emi,
                    interestPaid: 0,
                    remainingBalance: Math.max(0, Number(balance.toFixed(2))),
                });
            }
            return {
                monthlyEmi: emi,
                totalPayable: principal,
                totalInterest: 0,
                schedule,
            };
        }
        const monthlyRate = annualInterestRate / 12 / 100;
        const factor = Math.pow(1 + monthlyRate, tenureMonths);
        const emi = Number(((principal * monthlyRate * factor) / (factor - 1)).toFixed(2));
        const totalPayable = Number((emi * tenureMonths).toFixed(2));
        const totalInterest = Number((totalPayable - principal).toFixed(2));
        const schedule = [];
        let balance = principal;
        for (let i = 1; i <= tenureMonths; i++) {
            const interestForMonth = Number((balance * monthlyRate).toFixed(2));
            const principalForMonth = Number(Math.min(balance, emi - interestForMonth).toFixed(2));
            balance = Math.max(0, Number((balance - principalForMonth).toFixed(2)));
            const payDate = new Date(startDate);
            payDate.setMonth(payDate.getMonth() + i);
            schedule.push({
                month: i,
                paymentDate: payDate.toISOString().split('T')[0],
                emi,
                principalPaid: principalForMonth,
                interestPaid: interestForMonth,
                remainingBalance: balance,
            });
            if (balance <= 0)
                break;
        }
        return {
            monthlyEmi: emi,
            totalPayable,
            totalInterest,
            schedule,
        };
    }
}
exports.InvestmentCalculator = InvestmentCalculator;
