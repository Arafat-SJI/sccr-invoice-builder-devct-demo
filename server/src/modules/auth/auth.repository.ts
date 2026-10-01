import prisma from '../../database';

export const authRepository = {
  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },
  createUser: async (data: { name: string; email: string; passwordHash: string }) => {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: 'USER',
        status: 'ACTIVE',
      },
    });
  },
};
