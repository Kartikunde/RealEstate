import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateJwt, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt, requireAdmin);

router.get('/stats', AdminController.getPlatformStats);
router.get('/users', AdminController.getAllUsers);
router.post('/listings', AdminController.createListing);
router.delete('/listings/:id', AdminController.deleteListing);

export default router;
