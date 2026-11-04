import { Router } from 'express';
import { MarketplaceController } from '../controllers/marketplace.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { marketplaceInquirySchema } from '../schemas';

const router = Router();

router.get('/listings', MarketplaceController.getListings);
router.get('/listings/:id', MarketplaceController.getListingById);
router.post('/inquiry', validateRequest(marketplaceInquirySchema), MarketplaceController.contactSeller);

export default router;
