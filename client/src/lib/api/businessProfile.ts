import apiClient, { extractApiError } from '@/lib/api/client';

export interface BusinessProfile {
  id?: string;
  userId?: string;
  businessName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  taxId?: string | null;
  contactEmail: string;
  contactPhone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch the authenticated user's business profile.
 *
 * Uses the shared apiClient which adds Authorization headers automatically. This ensures
 * the request is sent to the correct Express backend host defined by NEXT_PUBLIC_API_URL
 * and includes the Bearer token from auth-utils.
 *
 * Returns the BusinessProfile object or null if none exists.
 * Throws a normalized ApiError via extractApiError for non-2xx responses.
 */
export async function getBusinessProfile(): Promise<BusinessProfile | null> {
  try {
    const res = await apiClient.get<{ profile: BusinessProfile | null }>('/profile');
    return res.data.profile ?? null;
  } catch (e) {
    throw extractApiError(e);
  }
}

/**
 * Create or update the authenticated user's business profile.
 *
 * Although the BusinessProfile interface includes read-only fields (id, userId, timestamps),
 * the backend will ignore or overwrite them as appropriate. Callers can pass the editable
 * fields and any server-managed fields will be safely handled by the API.
 *
 * Returns the persisted BusinessProfile from the server.
 * Throws a normalized ApiError via extractApiError for non-2xx responses.
 */
export async function upsertBusinessProfile(payload: BusinessProfile): Promise<BusinessProfile> {
  try {
    const res = await apiClient.put<{ profile: BusinessProfile }>('/profile', payload);
    return res.data.profile;
  } catch (e) {
    throw extractApiError(e);
  }
}
