import { Router, type Response } from 'express';
import type { AuthRequest } from './auth.types';
import { register, login } from './auth.controller';
import { validate, registerSchema, loginSchema } from './auth.validation';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/authorization.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Example admin-only route to demonstrate role-based access control
router.get('/admin/ping', authenticateToken, requireRole(['ADMIN']), (req: AuthRequest, res: Response) => {
  return res.json({ message: 'Admin access granted', user: req.user });
});

export default router;
