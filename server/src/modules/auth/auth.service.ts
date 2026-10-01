import { authRepository } from './auth.repository';
import { hashPassword, comparePassword } from '../../utils/password.utils';
import { generateToken } from '../../utils/jwt.utils';
import { LoginInput, RegisterInput, SafeUser, User } from './auth.types';

function toSafeUser(user: any): SafeUser {
  const { passwordHash, ...safe } = user as User & { passwordHash?: string };
  return safe as SafeUser;
}

export const authService = {
  // Backward compatible method retained (originally used in controller)
  register: async (data: RegisterInput) => {
    const created = await authService.registerUser(data.name, data.email, data.password);
    return created;
  },

  registerUser: async (name: string, email: string, password: string): Promise<SafeUser> => {
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await authRepository.findUserByEmail(normalizedEmail);
    if (existing) {
      const err = new Error('Email already in use');
      (err as any).code = 'DUPLICATE_EMAIL';
      throw err;
    }

    const passwordHash = await hashPassword(password);
    const user = await authRepository.createUser({ name: name.trim(), email: normalizedEmail, passwordHash });
    return toSafeUser(user);
  },

  loginUser: async (email: string, password: string): Promise<{ token: string; user: SafeUser }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findUserByEmail(normalizedEmail);

    const invalid = () => {
      const err = new Error('Invalid credentials');
      (err as any).code = 'INVALID_CREDENTIALS';
      return err;
    };

    if (!user) {
      throw invalid();
    }

    if (user.status && String(user.status).toUpperCase() !== 'ACTIVE') {
      throw invalid();
    }

    const ok = await comparePassword(password, (user as any).passwordHash);
    if (!ok) {
      throw invalid();
    }

    const token = generateToken({ id: String(user.id), role: (user as any).role || 'USER' });
    return { token, user: toSafeUser(user) };
  },
};
