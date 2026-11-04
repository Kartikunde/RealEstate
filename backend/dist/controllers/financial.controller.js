"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialController = void 0;
const db_1 = require("../config/db");
class FinancialController {
    /**
     * Get all income and expense records with filtering
     */
    static async getRecords(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { propertyId, type, category, startDate, endDate } = req.query;
            const where = { userId: req.user.id };
            if (propertyId && propertyId !== 'ALL') {
                where.propertyId = String(propertyId);
            }
            if (type && type !== 'ALL') {
                where.type = type;
            }
            if (category && category !== 'ALL') {
                where.category = category;
            }
            if (startDate || endDate) {
                where.transactionDate = {};
                if (startDate)
                    where.transactionDate.gte = new Date(String(startDate));
                if (endDate)
                    where.transactionDate.lte = new Date(String(endDate));
            }
            const records = await db_1.prisma.financialRecord.findMany({
                where,
                orderBy: { transactionDate: 'desc' },
                include: {
                    property: {
                        select: { id: true, name: true, city: true },
                    },
                },
            });
            // Calculate totals
            const totalIncome = records
                .filter((r) => r.type === 'INCOME')
                .reduce((sum, r) => sum + r.amount, 0);
            const totalExpense = records
                .filter((r) => r.type === 'EXPENSE')
                .reduce((sum, r) => sum + r.amount, 0);
            res.status(200).json({
                success: true,
                data: {
                    records,
                    summary: {
                        totalIncome,
                        totalExpense,
                        netCashFlow: totalIncome - totalExpense,
                    },
                },
            });
        }
        catch (error) {
            console.error('Financial records error:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve financial records.' });
        }
    }
    /**
     * Create financial record (income or expense)
     */
    static async createRecord(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { propertyId, type, category, amount, transactionDate, description, receiptUrl } = req.body;
            const record = await db_1.prisma.financialRecord.create({
                data: {
                    userId: req.user.id,
                    propertyId: propertyId || null,
                    type,
                    category,
                    amount: Number(amount),
                    transactionDate: new Date(transactionDate),
                    description: description || null,
                    receiptUrl: receiptUrl || null,
                },
                include: {
                    property: { select: { id: true, name: true } },
                },
            });
            // Also record in the global transactions ledger
            await db_1.prisma.transaction.create({
                data: {
                    userId: req.user.id,
                    propertyId: propertyId || null,
                    type: type === 'INCOME' ? 'RENTAL_INCOME' : 'MAINTENANCE_EXPENSE',
                    amount: Number(amount),
                    date: new Date(transactionDate),
                    description: description || `${type} recorded under ${category}`,
                    paymentMethod: 'Bank Transfer',
                },
            });
            res.status(201).json({
                success: true,
                message: `${type === 'INCOME' ? 'Income' : 'Expense'} record added successfully.`,
                data: record,
            });
        }
        catch (error) {
            console.error('Error creating financial record:', error);
            res.status(500).json({ success: false, message: 'Failed to create financial record.' });
        }
    }
    /**
     * Delete financial record
     */
    static async deleteRecord(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const existing = await db_1.prisma.financialRecord.findFirst({
                where: { id, userId: req.user.id },
            });
            if (!existing) {
                res.status(404).json({ success: false, message: 'Record not found.' });
                return;
            }
            await db_1.prisma.financialRecord.delete({ where: { id } });
            res.status(200).json({ success: true, message: 'Financial record deleted successfully.' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to delete record.' });
        }
    }
}
exports.FinancialController = FinancialController;
