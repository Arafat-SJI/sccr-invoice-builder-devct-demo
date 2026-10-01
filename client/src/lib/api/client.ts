import { getToken } from '@/lib/auth/auth-utils';

// Normalize and use the client-visible API base URL. Fallback to localhost for dev.
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

/**
 * Collection of field-specific error messages keyed by field name.
 */
export type FieldErrors = Record<string, string | string[]>;

/**
 * Standardized API error shape returned by extractApiError for consistent handling.
 */
export type ApiError = {
  message?: string;
  errors?: FieldErrors;
  status?: number;
};

function buildHeaders(extra?: HeadersInit): HeadersInit {
  const token = getToken();
  const auth = token ? { Authorization: `Bearer ${token}` } : {};
  return {
    'Content-Type': 'application/json',
    ...auth,
    ...(extra || {}),
  } as HeadersInit;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: buildHeaders(init?.headers as HeadersInit),
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let body: any = undefined;
    try {
      body = isJson ? await res.json() : await res.text();
    } catch {
      // ignore parse errors
    }

    const apiErr: ApiError = {
      status: res.status,
      message:
        (body && typeof body.message === 'string' && body.message) ||
        (typeof body === 'string' && body) ||
        'An unexpected error occurred.',
      errors: body && typeof body.errors === 'object' ? (body.errors as FieldErrors) : undefined,
    };
    throw apiErr;
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return (isJson ? await res.json() : (await res.text())) as T;
}

/**
 * Shared API client with a familiar axios-like surface for get/post/put using fetch under the hood.
 */
export const apiClient = {
  get<T>(path: string) {
    return request<T>(path, { method: 'GET' });
  },
  post<T>(path: string, data?: unknown) {
    return request<T>(path, { method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined });
  },
  put<T>(path: string, data?: unknown) {
    return request<T>(path, { method: 'PUT', body: data !== undefined ? JSON.stringify(data) : undefined });
  },
};

/**
 * Extracts a consistent ApiError object from unknown errors thrown by request().
 * Falls back to a generic message when the error shape is unexpected.
 */
export function extractApiError(error: unknown): ApiError {
  const fallback: ApiError = { message: 'An unexpected error occurred.' };

  if (error && typeof error === 'object') {
    const maybe = error as any;
    const message = typeof maybe.message === 'string' ? maybe.message : undefined;
    const errors = maybe.errors && typeof maybe.errors === 'object' ? (maybe.errors as FieldErrors) : undefined;
    const status = typeof maybe.status === 'number' ? maybe.status : undefined;

    if (message || errors || status) {
      return { message, errors, status };
    }
  }

  if (error instanceof Error && error.message) {
    return { message: error.message };
  }

  return fallback;
}
