"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const db_1 = require("../config/db");
class AdminController {
    /**
     * Platform-wide high-level metrics for Administrator
     */
    static async getPlatformStats(req, res) {
        try {
            const [totalUsers, totalProperties, totalMarketplaceListings, allProperties, allFinancials,] = await Promise.all([
                db_1.prisma.user.count(),
                db_1.prisma.property.count(),
                db_1.prisma.marketplaceListing.count(),
                db_1.prisma.property.findMany({ select: { currentValuation: true, purchasePrice: true } }),
                db_1.prisma.financialRecord.findMany({ select: { type: true, amount: true } }),
            ]);
            const aggregatePortfolioValue = allProperties.reduce((sum, p) => sum + p.currentValuation, 0);
            const aggregateInvested = allProperties.reduce((sum, p) => sum + p.purchasePrice, 0);
            const totalIncomeFlow = allFinancials.filter((f) => f.type === 'INCOME').reduce((sum, f) => sum + f.amount, 0);
            res.status(200).json({
                success: true,
                data: {
                    totalUsers,
                    totalProperties,
                    totalMarketplaceListings,
                    aggregatePortfolioValue,
                    aggregateInvested,
                    totalIncomeFlow,
                    systemStatus: 'HEALTHY',
                    dbEngine: 'PostgreSQL 18 (Connected)',
                    environment: process.env.NODE_ENV || 'development',
                },
            });
        }
        catch (error) {
            console.error('Error fetching admin platform stats:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
        }
    }
    /**
     * Get all registered users for admin review
     */
    static async getAllUsers(req, res) {
        try {
            const users = await db_1.prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                    _count: {
                        select: { properties: true, loans: true, watchlist: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            res.status(200).json({ success: true, data: users });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
        }
    }
    /**
     * Add a new marketplace listing (Admin only)
     */
    static async createListing(req, res) {
        try {
            const data = req.body;
            const listing = await db_1.prisma.marketplaceListing.create({
                data: {
                    title: data.title,
                    type: data.type,
                    description: data.description,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    pinCode: data.pinCode,
                    latitude: data.latitude || null,
                    longitude: data.longitude || null,
                    price: Number(data.price),
                    area: Number(data.area),
                    areaUnit: data.areaUnit || 'SQFT',
                    bedrooms: data.bedrooms ? Number(data.bedrooms) : 0,
                    bathrooms: data.bathrooms ? Number(data.bathrooms) : 0,
                    estimatedRentalIncome: Number(data.estimatedRentalIncome),
                    estimatedRentalYield: Number(data.estimatedRentalYield),
                    estimatedAnnualAppreciation: Number(data.estimatedAnnualAppreciation),
                    imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                    imageGallery: data.imageGallery ? JSON.stringify(data.imageGallery) : null,
                    specifications: data.specifications ? JSON.stringify(data.specifications) : null,
                    sellerName: data.sellerName || 'Verified Broker Desk',
                    sellerPhone: data.sellerPhone || '+91 99000 11222',
                    sellerEmail: data.sellerEmail || 'sales@propvest.in',
                    isDemo: true,
                },
            });
            res.status(201).json({
                success: true,
                message: 'Marketplace listing published successfully',
                data: listing,
            });
        }
        catch (error) {
            console.error('Error creating marketplace listing:', error);
            res.status(500).json({ success: false, message: 'Failed to create listing.' });
        }
    }
    /**
     * Delete marketplace listing (Admin only)
     */
    static async deleteListing(req, res) {
        try {
            const { id } = req.params;
            await db_1.prisma.marketplaceListing.delete({ where: { id } });
            res.status(200).json({ success: true, message: 'Marketplace listing deleted successfully.' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to delete listing.' });
        }
    }
}
exports.AdminController = AdminController;
