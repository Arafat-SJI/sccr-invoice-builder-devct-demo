import prisma from '../../database';
import { hash } from 'bcrypt';
import { RegisterInput } from './auth.types';

export const authService = {
  register: async (data: RegisterInput) => {
    const hashedPassword = await hash(data.password, 10);
    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });
  },
};
