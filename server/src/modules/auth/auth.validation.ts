import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
    return res.status(400).json({ message: 'Validation failed', errors: issues });
  }
  req.body = parseResult.data;
  return next();
};
