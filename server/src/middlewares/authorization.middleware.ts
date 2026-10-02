import { Request, Response, NextFunction } from 'express';

type Role = 'USER' | 'ADMIN';

type ResourceWithOwner = { userId: string };

type GetResourceFn<T extends ResourceWithOwner> = (id: string) => Promise<T | null>;

/**
 * requireRole enforces that the authenticated user's role is one of the allowed roles.
 * - If no role is present on the request, responds with 401 Unauthorized.
 * - If allowedRoles is empty or the role is not allowed, responds with 403 Forbidden.
 */
export function requireRole(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role: Role | undefined = (req as any).role || (req as any).user?.role;

    if (!role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role.' });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role.' });
    }

    return next();
  };
}

/**
 * requireOwnership ensures that the authenticated user owns the resource.
 * - If role is ADMIN, ownership checks are bypassed (admin access).
 * - If userId is missing, responds with 401 Unauthorized.
 * - If resource is not found, responds with 404 Not Found.
 * - If resource.userId !== req.userId, responds with 403 Forbidden.
 */
export function requireOwnership<T extends ResourceWithOwner>(getResourceFn: GetResourceFn<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role: Role | undefined = (req as any).role || (req as any).user?.role;
      const userId: string | undefined = (req as any).userId || (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Admin bypasses ownership checks
      if (role === 'ADMIN') {
        return next();
      }

      const resourceId = req.params.id;
      if (!resourceId) {
        return res.status(400).json({ message: 'Bad Request: Missing resource id.' });
      }

      const resource = await getResourceFn(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Not Found: Resource not found.' });
      }

      if (resource.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden: Resource ownership mismatch.' });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

/**
 * Convenience wrapper for express routes that want a named ownership middleware.
 * Keeps the public API clearer when wiring customer-specific handlers in routes.
 * Example usage:
 *   router.get('/:id', requireOwnershipByName(getCustomerById), getCustomerHandler)
 */
export function requireOwnershipByName<T extends ResourceWithOwner>(getResourceFn: GetResourceFn<T>) {
  return requireOwnership(getResourceFn);
}
