import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.get('/portfolio', ReportController.getPortfolioSummaryReport);
router.get('/rentals', ReportController.getRentalIncomeReport);
router.get('/expenses', ReportController.getExpenseReport);
router.get('/loans', ReportController.getLoanReport);

export default router;
