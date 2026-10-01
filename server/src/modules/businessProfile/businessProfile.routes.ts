import { Router } from 'express';
import businessProfileController from './businessProfile.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

// Protect all routes in this router
router.use(authenticateToken);

router.get('/', businessProfileController.getBusinessProfile);
router.put('/', businessProfileController.upsertBusinessProfile);

export default router;
