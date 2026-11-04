import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { PaymentStatus } from '@prisma/client';

export class RentalController {
  /**
   * Get rental management overview: active leases, occupancy, payments
   */
  static async getOverview(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const userId = req.user.id;

      const properties = await prisma.property.findMany({
        where: { userId },
        include: {
          agreements: {
            include: {
              payments: {
                orderBy: { dueDate: 'desc' },
                take: 12,
              },
            },
          },
        },
      });

      const totalProperties = properties.length;
      const occupiedProperties = properties.filter((p) => p.status === 'RENTED').length;
      const vacantProperties = totalProperties - occupiedProperties;

      const agreements = properties.flatMap((p) =>
        p.agreements.map((a) => ({
          ...a,
          propertyName: p.name,
          propertyCity: p.city,
          propertyImage: p.imageUrl,
        }))
      );

      const allPayments = agreements.flatMap((a) =>
        a.payments.map((pm) => ({
          ...pm,
          tenantName: a.tenantName,
          propertyName: a.propertyName,
        }))
      );

      const totalExpectedMonthly = properties.reduce(
        (sum, p) => sum + (p.monthlyRentalIncome || 0),
        0
      );

      const receivedPayments = allPayments.filter((pm) => pm.status === 'PAID');
      const pendingPayments = allPayments.filter(
        (pm) => pm.status === 'PENDING' || pm.status === 'OVERDUE'
      );

      const totalReceived = receivedPayments.reduce((sum, pm) => sum + pm.amount, 0);
      const totalPending = pendingPayments.reduce((sum, pm) => sum + pm.amount, 0);

      res.status(200).json({
        success: true,
        data: {
          summary: {
            totalProperties,
            occupiedProperties,
            vacantProperties,
            occupancyRate: totalProperties > 0 ? Number(((occupiedProperties / totalProperties) * 100).toFixed(1)) : 0,
            totalExpectedMonthly,
            totalReceived,
            totalPending,
          },
          agreements,
          recentPayments: allPayments.slice(0, 15),
        },
      });
    } catch (error) {
      console.error('Rental overview error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve rental data.' });
    }
  }

  /**
   * Create new rental agreement
   */
  static async createAgreement(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const {
        propertyId,
        tenantName,
        tenantEmail,
        tenantPhone,
        monthlyRent,
        securityDeposit,
        startDate,
        endDate,
        paymentDueDate,
        notes,
      } = req.body;

      // Verify property belongs to user
      const property = await prisma.property.findFirst({
        where: { id: propertyId, userId: req.user.id },
      });

      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found.' });
        return;
      }

      const agreement = await prisma.rentalAgreement.create({
        data: {
          propertyId,
          tenantName,
          tenantEmail: tenantEmail || null,
          tenantPhone,
          monthlyRent: Number(monthlyRent),
          securityDeposit: Number(securityDeposit || 0),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          paymentDueDate: Number(paymentDueDate || 5),
          notes: notes || null,
          status: 'ACTIVE',
        },
      });

      // Update property status to RENTED and set monthly rental income
      await prisma.property.update({
        where: { id: propertyId },
        data: {
          status: 'RENTED',
          monthlyRentalIncome: Number(monthlyRent),
        },
      });

      res.status(201).json({
        success: true,
        message: 'Rental agreement created and property marked as RENTED.',
        data: agreement,
      });
    } catch (error) {
      console.error('Error creating rental agreement:', error);
      res.status(500).json({ success: false, message: 'Failed to create rental agreement.' });
    }
  }

  /**
   * Record a rental payment
   */
  static async recordPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { agreementId, amount, paymentDate, paymentMethod, notes, receiptUrl } = req.body;

      const agreement = await prisma.rentalAgreement.findUnique({
        where: { id: agreementId },
        include: { property: true },
      });

      if (!agreement || agreement.property.userId !== req.user.id) {
        res.status(404).json({ success: false, message: 'Rental agreement not found.' });
        return;
      }

      const payment = await prisma.rentalPayment.create({
        data: {
          agreementId,
          propertyId: agreement.propertyId,
          amount: Number(amount),
          dueDate: new Date(paymentDate),
          paymentDate: new Date(paymentDate),
          status: PaymentStatus.PAID,
          paymentMethod: paymentMethod || 'Bank Transfer',
          notes: notes || `Rent paid by ${agreement.tenantName}`,
          receiptUrl: receiptUrl || null,
        },
      });

      // Also create an income entry in FinancialRecords
      await prisma.financialRecord.create({
        data: {
          userId: req.user.id,
          propertyId: agreement.propertyId,
          type: 'INCOME',
          category: 'RENTAL_INCOME',
          amount: Number(amount),
          transactionDate: new Date(paymentDate),
          description: `Rent payment received from ${agreement.tenantName} for ${agreement.property.name}`,
          receiptUrl: receiptUrl || null,
        },
      });

      // Ledger transaction
      await prisma.transaction.create({
        data: {
          userId: req.user.id,
          propertyId: agreement.propertyId,
          type: 'RENTAL_INCOME',
          amount: Number(amount),
          date: new Date(paymentDate),
          description: `Rent received from ${agreement.tenantName}`,
          paymentMethod: paymentMethod || 'Bank Transfer',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Rental payment recorded and reflected in portfolio finances.',
        data: payment,
      });
    } catch (error) {
      console.error('Error recording rental payment:', error);
      res.status(500).json({ success: false, message: 'Failed to record payment.' });
    }
  }
}
