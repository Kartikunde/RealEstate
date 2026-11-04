import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema } from '../schemas';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get('/me', authenticateJwt, AuthController.getMe);
router.put('/profile', authenticateJwt, AuthController.updateProfile);
router.put('/change-password', authenticateJwt, validateRequest(changePasswordSchema), AuthController.changePassword);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), AuthController.forgotPassword);

export default router;
