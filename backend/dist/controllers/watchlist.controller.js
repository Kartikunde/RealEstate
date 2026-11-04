"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchlistController = void 0;
const db_1 = require("../config/db");
class WatchlistController {
    /**
     * Get all watchlist items for user
     */
    static async getWatchlist(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const items = await db_1.prisma.watchlist.findMany({
                where: { userId: req.user.id },
                include: {
                    listing: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            const parsed = items.map((w) => ({
                ...w,
                listing: {
                    ...w.listing,
                    imageGallery: w.listing.imageGallery ? JSON.parse(w.listing.imageGallery) : [w.listing.imageUrl],
                    specifications: w.listing.specifications ? JSON.parse(w.listing.specifications) : {},
                    pricePerSqFt: Number((w.listing.price / (w.listing.area || 1)).toFixed(2)),
                },
            }));
            res.status(200).json({ success: true, data: parsed });
        }
        catch (error) {
            console.error('Error fetching watchlist:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve watchlist.' });
        }
    }
    /**
     * Add listing to watchlist
     */
    static async addToWatchlist(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { listingId } = req.body;
            if (!listingId) {
                res.status(400).json({ success: false, message: 'Listing ID is required.' });
                return;
            }
            const existing = await db_1.prisma.watchlist.findUnique({
                where: {
                    userId_listingId: {
                        userId: req.user.id,
                        listingId,
                    },
                },
            });
            if (existing) {
                res.status(409).json({ success: false, message: 'Property is already in your watchlist.' });
                return;
            }
            const created = await db_1.prisma.watchlist.create({
                data: {
                    userId: req.user.id,
                    listingId,
                },
                include: { listing: true },
            });
            res.status(201).json({
                success: true,
                message: 'Property added to watchlist',
                data: created,
            });
        }
        catch (error) {
            console.error('Error adding to watchlist:', error);
            res.status(500).json({ success: false, message: 'Failed to add to watchlist.' });
        }
    }
    /**
     * Remove listing from watchlist
     */
    static async removeFromWatchlist(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const { listingId } = req.params;
            await db_1.prisma.watchlist.deleteMany({
                where: {
                    userId: req.user.id,
                    listingId,
                },
            });
            res.status(200).json({ success: true, message: 'Property removed from watchlist.' });
        }
        catch (error) {
            console.error('Error removing from watchlist:', error);
            res.status(500).json({ success: false, message: 'Failed to remove from watchlist.' });
        }
    }
}
exports.WatchlistController = WatchlistController;
