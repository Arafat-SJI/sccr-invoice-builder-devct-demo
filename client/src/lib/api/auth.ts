import apiClient, { extractApiError } from '@/lib/api/client';

// Centralized auth API module
// This file now delegates HTTP concerns (baseURL, headers, auth) to the shared apiClient.
// Error extraction is also unified via extractApiError, ensuring consistent messaging and
// field-level error handling across the application.

export type User = {
  id: string | number;
  name?: string | null;
  email: string;
  role?: string | null;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

// Shared error shape used by backend responses. While extractApiError comes from the shared
// client, we keep these local type aliases to preserve existing imports and type usages in
// downstream code without forcing a wider refactor.
export type FieldErrors = Record<string, string | string[]>;

export type ApiError = {
  message?: string;
  errors?: FieldErrors;
};

/**
 * Register a new user.
 * Relies on the shared Axios client for baseURL resolution and Authorization header injection
 * (when a token is already available). The server is expected to return `{ token, user }`.
 *
 * Throws ApiError (via extractApiError) on non-2xx responses.
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  } catch (e) {
    // Normalize backend errors to a predictable shape
    throw extractApiError(e);
  }
}

/**
 * Login an existing user.
 * On success, the backend should return `{ token, user }`. Token storage and usage are handled
 * elsewhere (e.g., in auth-utils and via the shared client's interceptor adding Authorization).
 *
 * Throws ApiError (via extractApiError) on non-2xx responses.
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  } catch (e) {
    throw extractApiError(e);
  }
}

/**
 * Logout the current user.
 * If the backend supports server-side logout or token invalidation, this will notify it.
 * Any failure here is treated as non-fatal because client-side logout still proceeds.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout').catch(() => {});
  } catch (e) {
    // Non-fatal: client-side logout will still proceed
  }
}
