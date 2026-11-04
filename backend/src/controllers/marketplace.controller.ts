import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { PropertyType } from '@prisma/client';

export class MarketplaceController {
  /**
   * List all marketplace investment opportunities with filters & sorting
   */
  static async getListings(req: Request, res: Response): Promise<void> {
    try {
      const { search, city, type, minPrice, maxPrice, minYield, sortBy, sortOrder } = req.query;

      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: String(search), mode: 'insensitive' } },
          { city: { contains: String(search), mode: 'insensitive' } },
          { address: { contains: String(search), mode: 'insensitive' } },
          { description: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      if (city && city !== 'ALL') {
        where.city = { contains: String(city), mode: 'insensitive' };
      }

      if (type && type !== 'ALL') {
        where.type = type as PropertyType;
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      if (minYield) {
        where.estimatedRentalYield = { gte: Number(minYield) };
      }

      const orderBy: any = {};
      if (sortBy === 'price') {
        orderBy.price = sortOrder === 'desc' ? 'desc' : 'asc';
      } else if (sortBy === 'yield') {
        orderBy.estimatedRentalYield = sortOrder === 'asc' ? 'asc' : 'desc';
      } else if (sortBy === 'appreciation') {
        orderBy.estimatedAnnualAppreciation = sortOrder === 'asc' ? 'asc' : 'desc';
      } else {
        orderBy.createdAt = 'desc';
      }

      const listings = await prisma.marketplaceListing.findMany({
        where,
        orderBy,
      });

      const parsedListings = listings.map((item) => ({
        ...item,
        imageGallery: item.imageGallery ? JSON.parse(item.imageGallery) : [item.imageUrl],
        specifications: item.specifications ? JSON.parse(item.specifications) : {},
        pricePerSqFt: Number((item.price / (item.area || 1)).toFixed(2)),
      }));

      res.status(200).json({ success: true, data: parsedListings });
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve marketplace listings.' });
    }
  }

  /**
   * Get single marketplace listing by ID
   */
  static async getListingById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const listing = await prisma.marketplaceListing.findUnique({
        where: { id },
      });

      if (!listing) {
        res.status(404).json({ success: false, message: 'Marketplace listing not found.' });
        return;
      }

      const parsed = {
        ...listing,
        imageGallery: listing.imageGallery ? JSON.parse(listing.imageGallery) : [listing.imageUrl],
        specifications: listing.specifications ? JSON.parse(listing.specifications) : {},
        pricePerSqFt: Number((listing.price / (listing.area || 1)).toFixed(2)),
      };

      res.status(200).json({ success: true, data: parsed });
    } catch (error) {
      console.error('Error fetching listing:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve listing details.' });
    }
  }

  /**
   * Demo Contact Seller Workflow
   */
  static async contactSeller(req: Request, res: Response): Promise<void> {
    try {
      const { listingId, userName, userEmail, userPhone, message } = req.body;

      const listing = await prisma.marketplaceListing.findUnique({
        where: { id: listingId },
      });

      if (!listing) {
        res.status(404).json({ success: false, message: 'Listing not found.' });
        return;
      }

      // Demo inquiry response
      res.status(200).json({
        success: true,
        message: `Thank you, ${userName}! Your investment inquiry for "${listing.title}" has been sent to ${listing.sellerName}. An investment advisor will contact you at ${userPhone || userEmail} shortly.`,
        data: {
          listingTitle: listing.title,
          sellerName: listing.sellerName,
          sellerEmail: listing.sellerEmail,
          inquiryReference: `INQ-${Date.now().toString().slice(-6)}`,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to process inquiry.' });
    }
  }
}
