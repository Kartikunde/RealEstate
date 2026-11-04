import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { InvestmentCalculator } from '../utils/calculator';

export class ComparisonController {
  /**
   * Compare up to 4 properties (can combine portfolio and marketplace properties)
   */
  static async compare(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { items } = req.body; // Array of { id: string, source: 'PORTFOLIO' | 'MARKETPLACE' }

      if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ success: false, message: 'Please provide at least 1 property to analyze or compare.' });
        return;
      }

      if (items.length > 4) {
        res.status(400).json({ success: false, message: 'A maximum of 4 properties can be compared at once.' });
        return;
      }

      const comparisonResults = [];

      for (const item of items) {
        if (item.source === 'PORTFOLIO') {
          const prop = await prisma.property.findFirst({
            where: { id: item.id, userId: req.user?.id },
          });

          if (prop) {
            const annualRent = (prop.monthlyRentalIncome || 0) * 12;
            const roi = InvestmentCalculator.calculateRoi(prop.currentValuation, prop.purchasePrice);
            const rentalYield = InvestmentCalculator.calculateGrossRentalYield(annualRent, prop.currentValuation);
            const appreciation = InvestmentCalculator.calculateCapitalAppreciation(prop.currentValuation, prop.purchasePrice);
            const pricePerSqFt = InvestmentCalculator.calculatePricePerSqFt(prop.currentValuation, prop.area);
            const annualAppreciationPct = prop.purchasePrice > 0 ? Number(((appreciation / prop.purchasePrice) * 100).toFixed(2)) : 0;

            comparisonResults.push({
              id: prop.id,
              source: 'PORTFOLIO',
              name: prop.name,
              location: `${prop.city}, ${prop.state}`,
              category: prop.type,
              price: prop.currentValuation,
              purchasePrice: prop.purchasePrice,
              area: prop.area,
              areaUnit: prop.areaUnit,
              bedrooms: prop.bedrooms,
              bathrooms: prop.bathrooms,
              pricePerSqFt,
              monthlyRentalIncome: prop.monthlyRentalIncome || 0,
              annualRentalIncome: annualRent,
              rentalYield,
              annualAppreciationPct,
              capitalAppreciation: appreciation,
              roi,
              imageUrl: prop.imageUrl,
              status: prop.status,
            });
          }
        } else {
          // MARKETPLACE
          const listing = await prisma.marketplaceListing.findUnique({
            where: { id: item.id },
          });

          if (listing) {
            const pricePerSqFt = InvestmentCalculator.calculatePricePerSqFt(listing.price, listing.area);
            const estimatedRoi = listing.estimatedRentalYield + listing.estimatedAnnualAppreciation;

            comparisonResults.push({
              id: listing.id,
              source: 'MARKETPLACE',
              name: listing.title,
              location: `${listing.city}, ${listing.state}`,
              category: listing.type,
              price: listing.price,
              purchasePrice: listing.price,
              area: listing.area,
              areaUnit: listing.areaUnit,
              bedrooms: listing.bedrooms,
              bathrooms: listing.bathrooms,
              pricePerSqFt,
              monthlyRentalIncome: listing.estimatedRentalIncome,
              annualRentalIncome: listing.estimatedRentalIncome * 12,
              rentalYield: listing.estimatedRentalYield,
              annualAppreciationPct: listing.estimatedAnnualAppreciation,
              capitalAppreciation: 0,
              roi: Number(estimatedRoi.toFixed(2)),
              imageUrl: listing.imageUrl,
              status: 'AVAILABLE',
            });
          }
        }
      }

      // Calculate comparative highs & lows
      const maxPrice = Math.max(...comparisonResults.map((c) => c.price));
      const minPrice = Math.min(...comparisonResults.map((c) => c.price));
      const maxYield = Math.max(...comparisonResults.map((c) => c.rentalYield));
      const maxRoi = Math.max(...comparisonResults.map((c) => c.roi));
      const minPricePerSqFt = Math.min(...comparisonResults.map((c) => c.pricePerSqFt));

      res.status(200).json({
        success: true,
        data: {
          properties: comparisonResults,
          highlights: {
            highestYieldProperty: comparisonResults.find((c) => c.rentalYield === maxYield)?.name,
            highestRoiProperty: comparisonResults.find((c) => c.roi === maxRoi)?.name,
            lowestPricePerSqFtProperty: comparisonResults.find((c) => c.pricePerSqFt === minPricePerSqFt)?.name,
            maxPrice,
            minPrice,
            maxYield,
            maxRoi,
            minPricePerSqFt,
          },
        },
      });
    } catch (error) {
      console.error('Comparison error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate comparison data.' });
    }
  }
}
