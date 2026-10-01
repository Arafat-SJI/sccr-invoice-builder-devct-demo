import { apiClient, extractApiError } from './client';
export type { ApiError, FieldErrors } from './client';

/**
 * User model returned from the authentication endpoints.
 */
export type User = {
  id: string | number;
  name?: string | null;
  email: string;
  role?: string | null;
};

/**
 * Standard authentication response from the API containing a JWT and user info.
 */
export type AuthResponse = {
  token: string;
  user: User;
};

/**
 * Credentials for logging in an existing user.
 */
export type LoginData = {
  email: string;
  password: string;
};

/**
 * Registration payload for creating a new user account.
 */
export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

/**
 * Register a new user.
 * On success, returns the token and basic user information.
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  } catch (e) {
    throw extractApiError(e);
  }
}

/**
 * Log in an existing user with credentials.
 * On success, returns the token and basic user information.
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
 * Optionally notify the server to invalidate/blacklist the token.
 * Client-side logout/cleanup should still proceed even if this fails.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout').catch(() => {});
  } catch (e) {
    // Non-fatal
  }
}
