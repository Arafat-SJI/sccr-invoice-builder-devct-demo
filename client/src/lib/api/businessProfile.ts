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

function getAuthToken(): string | null {
  // Try common keys used in apps; backend requires Authorization: Bearer
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    null
  );
}

function authHeaders() {
  const token = getAuthToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function getBusinessProfile(): Promise<BusinessProfile | null> {
  const res = await fetch('/api/profile', {
    method: 'GET',
    headers: authHeaders(),
    credentials: 'include',
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error((await res.json().catch(() => ({ message: 'Failed to fetch profile' }))).message);
  const data = await res.json();
  return data.profile ?? null;
}

export async function upsertBusinessProfile(payload: BusinessProfile): Promise<BusinessProfile> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (res.status === 401) throw new Error('Unauthorized');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.message || 'Failed to save profile';
    throw new Error(Array.isArray(body?.errors) ? `${msg}: ${body.errors.map((e: any) => e.message).join(', ')}` : msg);
  }
  return body.profile as BusinessProfile;
}
