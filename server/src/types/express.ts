/*
  Express Request augmentation for authenticated user context.
  Imported once from server.ts so ts-node-dev applies it during dev.
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
