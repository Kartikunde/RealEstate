import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { InvestmentCalculator } from '../utils/calculator';

export class LoanController {
  /**
   * Get all loans for current user with calculated repayment progress
   */
  static async getLoans(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const loans = await prisma.loan.findMany({
        where: { userId: req.user.id },
        include: {
          property: {
            select: { id: true, name: true, city: true, currentValuation: true },
          },
          emiPayments: {
            orderBy: { paymentDate: 'desc' },
            take: 12,
          },
        },
      });

      const enriched = loans.map((l) => {
        const calc = InvestmentCalculator.calculateEmi(l.principalAmount, l.interestRate, l.tenureMonths, l.startDate);
        const repaidPrincipal = Math.max(0, l.principalAmount - l.outstandingBalance);
        const progressPct = l.principalAmount > 0 ? Number(((repaidPrincipal / l.principalAmount) * 100).toFixed(1)) : 0;

        return {
          ...l,
          totalPayable: calc.totalPayable,
          totalInterest: calc.totalInterest,
          repaidPrincipal,
          progressPercentage: progressPct,
        };
      });

      const totalPrincipal = loans.reduce((sum, l) => sum + l.principalAmount, 0);
      const totalOutstanding = loans.reduce((sum, l) => sum + l.outstandingBalance, 0);
      const totalMonthlyEmi = loans.reduce((sum, l) => sum + l.emiAmount, 0);

      res.status(200).json({
        success: true,
        data: {
          summary: {
            activeLoansCount: loans.length,
            totalPrincipal,
            totalOutstanding,
            totalRepaid: totalPrincipal - totalOutstanding,
            totalMonthlyEmi,
          },
          loans: enriched,
        },
      });
    } catch (error) {
      console.error('Error fetching loans:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve loans.' });
    }
  }

  /**
   * Get loan by ID with full amortization schedule
   */
  static async getLoanById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      const loan = await prisma.loan.findFirst({
        where: { id, userId: req.user.id },
        include: {
          property: true,
          emiPayments: { orderBy: { paymentDate: 'desc' } },
        },
      });

      if (!loan) {
        res.status(404).json({ success: false, message: 'Loan not found.' });
        return;
      }

      const calculation = InvestmentCalculator.calculateEmi(
        loan.principalAmount,
        loan.interestRate,
        loan.tenureMonths,
        loan.startDate
      );

      res.status(200).json({
        success: true,
        data: {
          loan,
          calculation,
        },
      });
    } catch (error) {
      console.error('Error fetching loan details:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve loan details.' });
    }
  }

  /**
   * Calculate EMI tool (standalone preview calculator)
   */
  static calculatePreview(req: AuthRequest, res: Response): void {
    const { principal, interestRate, tenureMonths } = req.body;

    if (!principal || !interestRate || !tenureMonths) {
      res.status(400).json({ success: false, message: 'Principal, interest rate, and tenure are required.' });
      return;
    }

    const result = InvestmentCalculator.calculateEmi(
      Number(principal),
      Number(interestRate),
      Number(tenureMonths)
    );

    res.status(200).json({ success: true, data: result });
  }

  /**
   * Create new loan
   */
  static async createLoan(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { propertyId, bankName, principalAmount, interestRate, tenureMonths, startDate, notes } = req.body;

      // Check property ownership
      const property = await prisma.property.findFirst({
        where: { id: propertyId, userId: req.user.id },
      });

      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found.' });
        return;
      }

      // Calculate EMI
      const calc = InvestmentCalculator.calculateEmi(
        Number(principalAmount),
        Number(interestRate),
        Number(tenureMonths),
        new Date(startDate)
      );

      const loan = await prisma.loan.create({
        data: {
          userId: req.user.id,
          propertyId,
          bankName,
          principalAmount: Number(principalAmount),
          interestRate: Number(interestRate),
          tenureMonths: Number(tenureMonths),
          startDate: new Date(startDate),
          emiAmount: calc.monthlyEmi,
          outstandingBalance: Number(principalAmount),
          notes: notes || null,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Loan registered successfully',
        data: loan,
      });
    } catch (error) {
      console.error('Error creating loan:', error);
      res.status(500).json({ success: false, message: 'Failed to create loan.' });
    }
  }

  /**
   * Record EMI Payment
   */
  static async recordEmiPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { loanId, amountPaid, paymentDate, principalPaid, interestPaid, notes } = req.body;

      const loan = await prisma.loan.findFirst({
        where: { id: loanId, userId: req.user.id },
        include: { property: true },
      });

      if (!loan) {
        res.status(404).json({ success: false, message: 'Loan not found.' });
        return;
      }

      const actualPrincipal = principalPaid ? Number(principalPaid) : Number(amountPaid) * 0.4;
      const actualInterest = interestPaid ? Number(interestPaid) : Number(amountPaid) - actualPrincipal;
      const newBalance = Math.max(0, loan.outstandingBalance - actualPrincipal);

      // Create EMI Payment
      const payment = await prisma.loanEmiPayment.create({
        data: {
          loanId: loan.id,
          paymentDate: new Date(paymentDate || new Date()),
          amountPaid: Number(amountPaid),
          principalPaid: actualPrincipal,
          interestPaid: actualInterest,
          remainingBalance: newBalance,
          status: 'PAID',
          notes: notes || `Monthly EMI payment to ${loan.bankName}`,
        },
      });

      // Update outstanding balance on loan
      await prisma.loan.update({
        where: { id: loan.id },
        data: { outstandingBalance: newBalance },
      });

      // Also record in Transactions ledger
      await prisma.transaction.create({
        data: {
          userId: req.user.id,
          propertyId: loan.propertyId,
          type: 'LOAN_PAYMENT',
          amount: Number(amountPaid),
          date: new Date(paymentDate || new Date()),
          description: `EMI Paid to ${loan.bankName} for ${loan.property.name}`,
          paymentMethod: 'Auto Debit NACH',
        },
      });

      res.status(201).json({
        success: true,
        message: 'EMI payment successfully recorded and balance updated.',
        data: payment,
      });
    } catch (error) {
      console.error('Error recording EMI payment:', error);
      res.status(500).json({ success: false, message: 'Failed to record EMI payment.' });
    }
  }
}
