import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { loanSchema } from '../schemas';

const router = Router();

router.use(authenticateJwt);

router.get('/', LoanController.getLoans);
router.get('/:id', LoanController.getLoanById);
router.post('/', validateRequest(loanSchema), LoanController.createLoan);
router.post('/calculate-preview', LoanController.calculatePreview);
router.post('/payments', LoanController.recordEmiPayment);

export default router;
