import { Router } from 'express';
import { RentalController } from '../controllers/rental.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { rentalAgreementSchema, rentalPaymentRecordSchema } from '../schemas';

const router = Router();

router.use(authenticateJwt);

router.get('/', RentalController.getOverview);
router.post('/agreements', validateRequest(rentalAgreementSchema), RentalController.createAgreement);
router.post('/payments', validateRequest(rentalPaymentRecordSchema), RentalController.recordPayment);

export default router;
