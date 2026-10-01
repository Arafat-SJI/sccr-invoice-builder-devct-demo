import prisma from '../database';

export async function checkDatabaseConnection(): Promise<{
  ok: boolean;
  message?: string;
}> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, message };
  }
}
