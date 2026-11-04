import { Router } from 'express';
import { FinancialController } from '../controllers/financial.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { financialRecordSchema } from '../schemas';

const router = Router();

router.use(authenticateJwt);

router.get('/', FinancialController.getRecords);
router.post('/', validateRequest(financialRecordSchema), FinancialController.createRecord);
router.delete('/:id', FinancialController.deleteRecord);

export default router;
