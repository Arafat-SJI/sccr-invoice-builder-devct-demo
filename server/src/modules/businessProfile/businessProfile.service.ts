import businessProfileRepository from './businessProfile.repository';
import { BusinessProfile, UpsertBusinessProfileDTO } from './businessProfile.types';

async function getProfile(userId: string): Promise<BusinessProfile | null> {
  return businessProfileRepository.findByUserId(userId);
}

async function upsertProfile(userId: string, data: UpsertBusinessProfileDTO): Promise<BusinessProfile> {
  return businessProfileRepository.upsert(userId, data);
}

const businessProfileService = {
  getProfile,
  upsertProfile,
};

export default businessProfileService;
