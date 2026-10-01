/*
  Express Request augmentation for authenticated user context.
  This file extends the Express.Request interface so that middleware and controllers
  can read req.userId and req.role in a type-safe way across the application.
*/

import 'express';

declare global {
  namespace Express {
    interface UserContext {
      id: string;
      role: 'USER' | 'ADMIN';
    }

    interface Request {
      user?: UserContext;
      userId?: string;
      role?: 'USER' | 'ADMIN';
    }
  }
}

export {};