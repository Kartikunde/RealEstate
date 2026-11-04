import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.get('/', TransactionController.getTransactions);
router.get('/export/csv', TransactionController.exportCsv);

export default router;
