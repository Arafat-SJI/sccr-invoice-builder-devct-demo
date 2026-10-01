import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AuthRequest } from '../modules/auth/auth.types';

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = parts[1];
    const decoded = verifyToken(token);

    // Preserve existing user object and also attach top-level userId/role for convenience
    const role =
      decoded.role === 'ADMIN' || decoded.role === 'USER' ? decoded.role : 'USER';
    req.user = { id: decoded.id, role };
    req.userId = decoded.id;
    req.role = role;

    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
