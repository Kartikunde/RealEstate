import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { propertyCreateSchema } from '../schemas';

const router = Router();

router.use(authenticateJwt);

router.get('/', PropertyController.getAll);
router.get('/:id', PropertyController.getById);
router.post('/', validateRequest(propertyCreateSchema), PropertyController.create);
router.put('/:id', PropertyController.update);
router.delete('/:id', PropertyController.delete);

export default router;
