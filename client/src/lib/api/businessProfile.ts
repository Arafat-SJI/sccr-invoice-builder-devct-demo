import { apiClient, extractApiError } from './client';

/**
 * Represents the authenticated user's business profile data.
 */
export type BusinessProfile = {
  id: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * DTO for creating/updating a business profile. Excludes read-only fields.
 */
export type UpsertBusinessProfileDto = {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
};

/**
 * Fetch the current user's business profile from the Express API.
 */
export async function getBusinessProfile(): Promise<BusinessProfile> {
  try {
    const res = await apiClient.get<BusinessProfile>('/profile');
    return res.data;
  } catch (e) {
    throw extractApiError(e);
  }
}

/**
 * Create or update the current user's business profile.
 */
export async function upsertBusinessProfile(data: UpsertBusinessProfileDto): Promise<BusinessProfile> {
  try {
    const res = await apiClient.put<BusinessProfile>('/profile', data);
    return res.data;
  } catch (e) {
    throw extractApiError(e);
  }
}
