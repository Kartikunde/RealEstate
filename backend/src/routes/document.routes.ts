import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticateJwt);

router.get('/', DocumentController.getDocuments);
router.get('/:id/download', DocumentController.downloadDocument);
router.post('/upload', upload.single('file'), DocumentController.uploadDocument);
router.delete('/:id', DocumentController.deleteDocument);

export default router;
