import { PrismaClient } from '@prisma/client';

// Prevent multiple PrismaClient instances in development
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma: any = globalThis as any;

const prisma: PrismaClient = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
