import { Request, Response } from 'express';
import { authService } from './auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    const user = await authService.registerUser(name, email, password);
    res.status(201).json(user);
  } catch (error: any) {
    if (error && error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({ message: 'Email already in use' });
    }
    res.status(400).json({ message: error?.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    // Always return generic unauthorized for authentication failures
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
