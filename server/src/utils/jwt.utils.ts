import jwt, { JwtPayload as LibJwtPayload } from 'jsonwebtoken';
import { config } from '../config/env';
import { Role } from '../modules/auth/auth.types';

export interface TokenPayload {
  id: string;
  role: Role | string;
}

export interface VerifiedTokenPayload extends TokenPayload {
  iat?: number;
  exp?: number;
}

function getSecret(): string {
  const secret = config.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return secret;
}

export function generateToken(payload: TokenPayload): string {
  const secret = getSecret();
  const expiryRaw = config.JWT_EXPIRY_SECONDS;
  const expiresIn = expiryRaw ? Number(expiryRaw) : 3600;
  return jwt.sign({ id: payload.id, role: payload.role } as TokenPayload, secret, {
    expiresIn,
  });
}

export function verifyToken(token: string): VerifiedTokenPayload {
  const secret = getSecret();
  const decoded = jwt.verify(token, secret) as LibJwtPayload & TokenPayload;
  if (!decoded || typeof decoded !== 'object' || !('id' in decoded) || !('role' in decoded)) {
    throw new Error('Invalid token payload');
  }
  return {
    id: decoded.id as string,
    role: decoded.role as Role | string,
    iat: decoded.iat,
    exp: decoded.exp,
  };
}
