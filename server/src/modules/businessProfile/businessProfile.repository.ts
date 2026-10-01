import { PrismaClient } from '@prisma/client';
import { BusinessProfile, UpsertBusinessProfileDTO } from './businessProfile.types';

const prisma = new PrismaClient();

async function findByUserId(userId: string): Promise<BusinessProfile | null> {
  return prisma.businessProfile.findUnique({ where: { userId } }) as unknown as BusinessProfile | null;
}

async function upsert(userId: string, data: UpsertBusinessProfileDTO): Promise<BusinessProfile> {
  const profile = await prisma.businessProfile.upsert({
    where: { userId },
    update: { ...data },
    create: { userId, ...data },
  });
  return profile as unknown as BusinessProfile;
}

const businessProfileRepository = {
  findByUserId,
  upsert,
};

export default businessProfileRepository;
