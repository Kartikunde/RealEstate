import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { InvestmentCalculator } from '../utils/calculator';

export class AnalyticsController {
  /**
   * Main Dashboard Overview Metrics
   */
  static async getDashboardOverview(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const userId = req.user.id;

      // 1. Fetch properties
      const properties = await prisma.property.findMany({
        where: { userId },
        include: {
          agreements: { where: { status: 'ACTIVE' } },
          loans: true,
        },
      });

      // 2. Fetch financial records
      const financials = await prisma.financialRecord.findMany({
        where: { userId },
      });

      // 3. Fetch recent transactions
      const recentTransactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 5,
        include: { property: { select: { name: true } } },
      });

      // 4. Fetch upcoming loans/EMIs
      const loans = await prisma.loan.findMany({
        where: { userId },
        include: { property: { select: { name: true } } },
      });

      // 5. Fetch recent notifications
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      // Calculations
      const propertyCount = properties.length;
      const totalInvestment = properties.reduce((sum, p) => sum + p.purchasePrice, 0);
      const totalValuation = properties.reduce((sum, p) => sum + p.currentValuation, 0);
      const unrealizedGain = totalValuation - totalInvestment;

      const totalRentalIncome = financials
        .filter((f) => f.type === 'INCOME')
        .reduce((sum, f) => sum + f.amount, 0);

      const totalExpenses = financials
        .filter((f) => f.type === 'EXPENSE')
        .reduce((sum, f) => sum + f.amount, 0);

      const netProfit = totalRentalIncome - totalExpenses;
      const averageRoi = InvestmentCalculator.calculateRoi(totalValuation, totalInvestment);

      const occupiedCount = properties.filter((p) => p.status === 'RENTED').length;
      const occupancyRate = propertyCount > 0 ? Number(((occupiedCount / propertyCount) * 100).toFixed(1)) : 0;

      // Property type distribution
      const distributionMap: Record<string, { count: number; value: number }> = {};
      properties.forEach((p) => {
        if (!distributionMap[p.type]) {
          distributionMap[p.type] = { count: 0, value: 0 };
        }
        distributionMap[p.type].count += 1;
        distributionMap[p.type].value += p.currentValuation;
      });

      const propertyDistribution = Object.keys(distributionMap).map((type) => ({
        type,
        count: distributionMap[type].count,
        value: distributionMap[type].value,
        percentage: totalValuation > 0 ? Number(((distributionMap[type].value / totalValuation) * 100).toFixed(1)) : 0,
      }));

      // Monthly cash flow tracking (last 6 months)
      const monthlyCashFlow: Array<{ month: string; income: number; expense: number; net: number }> = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mIdx = d.getMonth();
        const y = d.getFullYear();
        const label = `${monthNames[mIdx]} ${y}`;

        const monthIncome = financials
          .filter((f) => {
            const fd = new Date(f.transactionDate);
            return f.type === 'INCOME' && fd.getMonth() === mIdx && fd.getFullYear() === y;
          })
          .reduce((sum, f) => sum + f.amount, 0);

        const monthExpense = financials
          .filter((f) => {
            const fd = new Date(f.transactionDate);
            return f.type === 'EXPENSE' && fd.getMonth() === mIdx && fd.getFullYear() === y;
          })
          .reduce((sum, f) => sum + f.amount, 0);

        monthlyCashFlow.push({
          month: label,
          income: monthIncome,
          expense: monthExpense,
          net: monthIncome - monthExpense,
        });
      }

      // Portfolio Growth Historical Projection / Trend
      const portfolioGrowthTrend = [
        { label: '2022', invested: Math.round(totalInvestment * 0.4), valuation: Math.round(totalInvestment * 0.45) },
        { label: '2023', invested: Math.round(totalInvestment * 0.65), valuation: Math.round(totalInvestment * 0.76) },
        { label: '2024', invested: Math.round(totalInvestment * 0.85), valuation: Math.round(totalInvestment * 1.05) },
        { label: '2025', invested: Math.round(totalInvestment * 0.95), valuation: Math.round(totalInvestment * 1.18) },
        { label: '2026 (Current)', invested: totalInvestment, valuation: totalValuation },
      ];

      res.status(200).json({
        success: true,
        data: {
          kpis: {
            totalPortfolioValue: totalValuation,
            totalInvestment,
            unrealizedGain,
            totalRentalIncome,
            totalExpenses,
            netProfit,
            averageRoi,
            propertyCount,
            occupancyRate,
            occupiedCount,
            vacantCount: propertyCount - occupiedCount,
          },
          charts: {
            propertyDistribution,
            monthlyCashFlow,
            portfolioGrowthTrend,
          },
          recentTransactions,
          recentlyAddedProperties: properties.slice(0, 4),
          upcomingLoans: loans.map((l) => ({
            id: l.id,
            propertyName: l.property.name,
            bankName: l.bankName,
            emiAmount: l.emiAmount,
            outstandingBalance: l.outstandingBalance,
          })),
          recentNotifications: notifications,
        },
      });
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate dashboard analytics.' });
    }
  }

  /**
   * Deep Investment Analytics Module
   */
  static async getInvestmentAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { period = 'YEARLY' } = req.query; // 'MONTHLY' | 'QUARTERLY' | 'YEARLY'

      const properties = await prisma.property.findMany({
        where: { userId: req.user.id },
        include: {
          loans: true,
          financialRecords: true,
          agreements: { where: { status: 'ACTIVE' } },
        },
      });

      const totalInvested = properties.reduce((sum, p) => sum + p.purchasePrice, 0);
      const currentValuation = properties.reduce((sum, p) => sum + p.currentValuation, 0);
      const totalAnnualRent = properties.reduce((sum, p) => sum + (p.monthlyRentalIncome || 0) * 12, 0);

      const totalRecordedExpenses = properties.reduce(
        (sum, p) =>
          sum +
          p.financialRecords
            .filter((f) => f.type === 'EXPENSE')
            .reduce((fSum, f) => fSum + f.amount, 0),
        0
      );

      const overallRoi = InvestmentCalculator.calculateRoi(currentValuation, totalInvested);
      const grossYield = InvestmentCalculator.calculateGrossRentalYield(totalAnnualRent, currentValuation);
      const netYield = InvestmentCalculator.calculateNetRentalYield(totalAnnualRent, totalRecordedExpenses, currentValuation);
      const capitalAppreciation = InvestmentCalculator.calculateCapitalAppreciation(currentValuation, totalInvested);

      // Property-wise breakdown
      const propertyBreakdown = properties.map((p) => {
        const annualRent = (p.monthlyRentalIncome || 0) * 12;
        const pExpenses = p.financialRecords
          .filter((f) => f.type === 'EXPENSE')
          .reduce((sum, f) => sum + f.amount, 0);

        const pRoi = InvestmentCalculator.calculateRoi(p.currentValuation, p.purchasePrice);
        const pGrossYield = InvestmentCalculator.calculateGrossRentalYield(annualRent, p.currentValuation);
        const pNetYield = InvestmentCalculator.calculateNetRentalYield(annualRent, pExpenses, p.currentValuation);
        const pAppreciation = InvestmentCalculator.calculateCapitalAppreciation(p.currentValuation, p.purchasePrice);
        const pCagr = InvestmentCalculator.calculateAnnualizedReturn(p.purchasePrice, p.currentValuation, p.purchaseDate);

        return {
          id: p.id,
          name: p.name,
          city: p.city,
          type: p.type,
          purchasePrice: p.purchasePrice,
          currentValuation: p.currentValuation,
          capitalAppreciation: pAppreciation,
          roi: pRoi,
          cagr: pCagr,
          annualRentalIncome: annualRent,
          grossYield: pGrossYield,
          netYield: pNetYield,
          pricePerSqFt: InvestmentCalculator.calculatePricePerSqFt(p.currentValuation, p.area),
        };
      });

      res.status(200).json({
        success: true,
        data: {
          summary: {
            totalInvested,
            currentValuation,
            unrealizedGain: currentValuation - totalInvested,
            overallRoi,
            grossYield,
            netYield,
            capitalAppreciation,
            totalAnnualRentalIncome: totalAnnualRent,
            totalRecordedExpenses,
            netRentalIncome: Math.max(0, totalAnnualRent - totalRecordedExpenses),
          },
          period,
          properties: propertyBreakdown,
        },
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve investment analytics.' });
    }
  }
}
