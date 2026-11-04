import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.get('/dashboard', AnalyticsController.getDashboardOverview);
router.get('/investments', AnalyticsController.getInvestmentAnalytics);

export default router;
