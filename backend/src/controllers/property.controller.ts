import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { InvestmentCalculator } from '../utils/calculator';
import { PropertyType, PropertyStatus } from '@prisma/client';

export class PropertyController {
  /**
   * Get all properties owned by current user
   */
  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { search, type, status, city, sortBy, sortOrder } = req.query;

      const where: any = { userId: req.user.id };

      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { address: { contains: String(search), mode: 'insensitive' } },
          { city: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      if (type && type !== 'ALL') {
        where.type = type as PropertyType;
      }

      if (status && status !== 'ALL') {
        where.status = status as PropertyStatus;
      }

      if (city && city !== 'ALL') {
        where.city = { contains: String(city), mode: 'insensitive' };
      }

      const orderBy: any = {};
      if (sortBy) {
        orderBy[String(sortBy)] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.createdAt = 'desc';
      }

      const properties = await prisma.property.findMany({
        where,
        orderBy,
        include: {
          agreements: {
            where: { status: 'ACTIVE' },
            select: { tenantName: true, monthlyRent: true, endDate: true },
          },
          loans: {
            select: { bankName: true, emiAmount: true, outstandingBalance: true },
          },
          _count: {
            select: { documents: true, financialRecords: true },
          },
        },
      });

      // Augment with calculated financial metrics
      const enriched = properties.map((p) => {
        const roi = InvestmentCalculator.calculateRoi(p.currentValuation, p.purchasePrice);
        const grossYield = InvestmentCalculator.calculateGrossRentalYield(
          (p.monthlyRentalIncome || 0) * 12,
          p.currentValuation
        );
        const capitalAppreciation = InvestmentCalculator.calculateCapitalAppreciation(
          p.currentValuation,
          p.purchasePrice
        );
        const pricePerSqFt = InvestmentCalculator.calculatePricePerSqFt(p.currentValuation, p.area);

        return {
          ...p,
          calculatedRoi: roi,
          calculatedGrossYield: grossYield,
          calculatedCapitalAppreciation: capitalAppreciation,
          calculatedPricePerSqFt: pricePerSqFt,
        };
      });

      res.status(200).json({ success: true, data: enriched });
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve properties.' });
    }
  }

  /**
   * Get single property by ID with rich details
   */
  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      const property = await prisma.property.findFirst({
        where: { id, userId: req.user.id },
        include: {
          agreements: {
            include: {
              payments: {
                orderBy: { dueDate: 'desc' },
                take: 10,
              },
            },
          },
          loans: {
            include: {
              emiPayments: {
                orderBy: { paymentDate: 'desc' },
                take: 5,
              },
            },
          },
          financialRecords: {
            orderBy: { transactionDate: 'desc' },
            take: 20,
          },
          documents: true,
          transactions: {
            orderBy: { date: 'desc' },
            take: 10,
          },
        },
      });

      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found.' });
        return;
      }

      // Calculations
      const annualRental = (property.monthlyRentalIncome || 0) * 12;
      const totalExpenses = property.financialRecords
        .filter((f) => f.type === 'EXPENSE')
        .reduce((sum, f) => sum + f.amount, 0);

      const roi = InvestmentCalculator.calculateRoi(property.currentValuation, property.purchasePrice);
      const grossYield = InvestmentCalculator.calculateGrossRentalYield(annualRental, property.currentValuation);
      const netYield = InvestmentCalculator.calculateNetRentalYield(annualRental, totalExpenses, property.currentValuation);
      const capitalAppreciation = InvestmentCalculator.calculateCapitalAppreciation(property.currentValuation, property.purchasePrice);
      const cagr = InvestmentCalculator.calculateAnnualizedReturn(property.purchasePrice, property.currentValuation, property.purchaseDate);
      const pricePerSqFt = InvestmentCalculator.calculatePricePerSqFt(property.currentValuation, property.area);

      // Monthly cash flow
      const activeLoan = property.loans[0];
      const monthlyEmi = activeLoan ? activeLoan.emiAmount : 0;
      const monthlyExpenses = totalExpenses > 0 ? totalExpenses / 12 : 0;
      const netCashFlow = InvestmentCalculator.calculateNetMonthlyCashFlow(
        property.monthlyRentalIncome || 0,
        monthlyExpenses,
        monthlyEmi
      );

      res.status(200).json({
        success: true,
        data: {
          ...property,
          metrics: {
            roi,
            grossYield,
            netYield,
            capitalAppreciation,
            annualizedReturn: cagr,
            pricePerSqFt,
            netMonthlyCashFlow: netCashFlow,
            annualRentalIncome: annualRental,
            totalRecordedExpenses: totalExpenses,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching property detail:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve property details.' });
    }
  }

  /**
   * Create new property
   */
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const data = req.body;

      const property = await prisma.property.create({
        data: {
          userId: req.user.id,
          name: data.name,
          type: data.type,
          description: data.description || null,
          address: data.address,
          city: data.city,
          state: data.state,
          pinCode: data.pinCode,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          purchasePrice: Number(data.purchasePrice),
          currentValuation: Number(data.currentValuation || data.purchasePrice),
          area: Number(data.area),
          areaUnit: data.areaUnit || 'SQFT',
          bedrooms: data.bedrooms !== undefined ? Number(data.bedrooms) : 0,
          bathrooms: data.bathrooms !== undefined ? Number(data.bathrooms) : 0,
          purchaseDate: new Date(data.purchaseDate),
          status: data.status || 'OWNED',
          monthlyRentalIncome: data.monthlyRentalIncome ? Number(data.monthlyRentalIncome) : 0,
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        },
      });

      // Automatically create the initial Purchase Transaction in the ledger
      await prisma.transaction.create({
        data: {
          userId: req.user.id,
          propertyId: property.id,
          type: 'PROPERTY_PURCHASE',
          amount: Number(data.purchasePrice),
          date: new Date(data.purchaseDate),
          description: `Acquisition of ${property.name}`,
          paymentMethod: 'Bank Transfer',
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: req.user.id,
          title: 'Property Added',
          message: `${property.name} in ${property.city} was successfully added to your portfolio.`,
          type: 'SUCCESS',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Property created successfully',
        data: property,
      });
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ success: false, message: 'Failed to create property.' });
    }
  }

  /**
   * Update property
   */
  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const data = req.body;

      const existing = await prisma.property.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existing) {
        res.status(404).json({ success: false, message: 'Property not found.' });
        return;
      }

      const updated = await prisma.property.update({
        where: { id },
        data: {
          name: data.name !== undefined ? data.name : undefined,
          type: data.type !== undefined ? data.type : undefined,
          description: data.description !== undefined ? data.description : undefined,
          address: data.address !== undefined ? data.address : undefined,
          city: data.city !== undefined ? data.city : undefined,
          state: data.state !== undefined ? data.state : undefined,
          pinCode: data.pinCode !== undefined ? data.pinCode : undefined,
          latitude: data.latitude !== undefined ? Number(data.latitude) : undefined,
          longitude: data.longitude !== undefined ? Number(data.longitude) : undefined,
          purchasePrice: data.purchasePrice !== undefined ? Number(data.purchasePrice) : undefined,
          currentValuation: data.currentValuation !== undefined ? Number(data.currentValuation) : undefined,
          area: data.area !== undefined ? Number(data.area) : undefined,
          areaUnit: data.areaUnit !== undefined ? data.areaUnit : undefined,
          bedrooms: data.bedrooms !== undefined ? Number(data.bedrooms) : undefined,
          bathrooms: data.bathrooms !== undefined ? Number(data.bathrooms) : undefined,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
          status: data.status !== undefined ? data.status : undefined,
          monthlyRentalIncome: data.monthlyRentalIncome !== undefined ? Number(data.monthlyRentalIncome) : undefined,
          imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Property updated successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({ success: false, message: 'Failed to update property.' });
    }
  }

  /**
   * Delete property
   */
  static async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      const existing = await prisma.property.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existing) {
        res.status(404).json({ success: false, message: 'Property not found.' });
        return;
      }

      await prisma.property.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Property deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ success: false, message: 'Failed to delete property.' });
    }
  }
}
