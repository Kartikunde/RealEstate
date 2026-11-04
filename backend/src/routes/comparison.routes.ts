import { Router } from 'express';
import { ComparisonController } from '../controllers/comparison.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

// Allow authenticated comparison
router.post('/', authenticateJwt, ComparisonController.compare);

export default router;
