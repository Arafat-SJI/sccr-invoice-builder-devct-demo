import axios, { AxiosError } from 'axios';
import { getToken } from '@/lib/auth/auth-utils';

// Normalize base URL from env and ensure no trailing slash
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export type FieldErrors = Record<string, string | string[]>;

export type ApiError = {
  message?: string;
  errors?: FieldErrors;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Authorization header when a token is present
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function extractApiError(error: unknown): ApiError {
  const fallback: ApiError = { message: 'An unexpected error occurred.' };
  if (!axios.isAxiosError(error)) return fallback;
  const err = error as AxiosError<any>;
  const data = err.response?.data;
  if (!data) return fallback;
  const message = typeof data.message === 'string' ? data.message : fallback.message;
  const errors = data && typeof data.errors === 'object' ? (data.errors as FieldErrors) : undefined;
  return { message, errors };
}

export default apiClient;
