import { Request } from 'express';

export type Role = 'USER' | 'ADMIN';
export type Status = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role | string;
  status: Status | string;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  role: Role | string;
  iat?: number;
  exp?: number;
}

/** JWT user context attached by `authenticateToken`. */
export interface AuthenticatedUser {
  id: string;
  role: Role;
}

/** Request after auth middleware (also augmented globally in `src/types/express.ts`). */
export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  userId?: string;
  role?: Role;
}
