import axios, { AxiosError } from 'axios';
import { getToken } from '@/lib/auth/auth-utils';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

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

export type FieldErrors = Record<string, string | string[]>;

export type ApiError = {
  message?: string;
  errors?: FieldErrors;
};

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

authApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

function extractApiError(error: unknown): ApiError {
  const fallback: ApiError = { message: 'An unexpected error occurred.' };
  if (!axios.isAxiosError(error)) return fallback;
  const err = error as AxiosError<any>;
  const data = err.response?.data;
  if (!data) return fallback;
  const message = typeof data.message === 'string' ? data.message : fallback.message;
  const errors = typeof data.errors === 'object' && data.errors ? data.errors : undefined;
  return { message, errors };
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const res = await authApi.post<AuthResponse>('/auth/register', data);
    return res.data;
  } catch (e) {
    throw extractApiError(e);
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const res = await authApi.post<AuthResponse>('/auth/login', data);
    return res.data;
  } catch (e) {
    throw extractApiError(e);
  }
}

export async function logout(): Promise<void> {
  try {
    // If backend supports server-side logout/token blacklist
    await authApi.post('/auth/logout').catch(() => {});
  } catch (e) {
    // Non-fatal: client-side logout will still proceed
  }
}
