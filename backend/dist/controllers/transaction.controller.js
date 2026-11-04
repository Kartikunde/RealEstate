"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const db_1 = require("../config/db");
class TransactionController {
    /**
     * Get all transactions with search, filter, pagination, and sorting
     */
    static async getTransactions(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { search, type, propertyId, startDate, endDate, page = '1', limit = '10', sortBy = 'date', sortOrder = 'desc', } = req.query;
            const pageNum = Math.max(1, parseInt(String(page), 10));
            const limitNum = Math.max(1, parseInt(String(limit), 10));
            const skip = (pageNum - 1) * limitNum;
            const where = { userId: req.user.id };
            if (search) {
                where.OR = [
                    { description: { contains: String(search), mode: 'insensitive' } },
                    { referenceNumber: { contains: String(search), mode: 'insensitive' } },
                    { paymentMethod: { contains: String(search), mode: 'insensitive' } },
                ];
            }
            if (type && type !== 'ALL') {
                where.type = type;
            }
            if (propertyId && propertyId !== 'ALL') {
                where.propertyId = String(propertyId);
            }
            if (startDate || endDate) {
                where.date = {};
                if (startDate)
                    where.date.gte = new Date(String(startDate));
                if (endDate)
                    where.date.lte = new Date(String(endDate));
            }
            const orderBy = {};
            orderBy[String(sortBy)] = sortOrder === 'asc' ? 'asc' : 'desc';
            const [transactions, totalCount] = await Promise.all([
                db_1.prisma.transaction.findMany({
                    where,
                    orderBy,
                    skip,
                    take: limitNum,
                    include: {
                        property: { select: { id: true, name: true, city: true } },
                    },
                }),
                db_1.prisma.transaction.count({ where }),
            ]);
            res.status(200).json({
                success: true,
                data: {
                    transactions,
                    pagination: {
                        total: totalCount,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(totalCount / limitNum),
                    },
                },
            });
        }
        catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve transactions.' });
        }
    }
    /**
     * Export transactions as CSV
     */
    static async exportCsv(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const transactions = await db_1.prisma.transaction.findMany({
                where: { userId: req.user.id },
                orderBy: { date: 'desc' },
                include: { property: { select: { name: true, city: true } } },
            });
            let csv = 'Transaction ID,Date,Type,Property,Amount (INR),Payment Method,Reference Number,Description\n';
            transactions.forEach((tx) => {
                const propName = tx.property ? `"${tx.property.name} (${tx.property.city})"` : '"General Portfolio"';
                const desc = `"${(tx.description || '').replace(/"/g, '""')}"`;
                const ref = `"${(tx.referenceNumber || '').replace(/"/g, '""')}"`;
                const method = `"${(tx.paymentMethod || '').replace(/"/g, '""')}"`;
                const dateStr = new Date(tx.date).toLocaleDateString('en-IN');
                csv += `"${tx.id}","${dateStr}","${tx.type}",${propName},${tx.amount},${method},${ref},${desc}\n`;
            });
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="propvest-transactions.csv"');
            res.status(200).send(csv);
        }
        catch (error) {
            console.error('Export CSV error:', error);
            res.status(500).json({ success: false, message: 'Failed to export CSV.' });
        }
    }
}
exports.TransactionController = TransactionController;
