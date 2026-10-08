import { AuthApiError } from '@supabase/supabase-js';

export type StoredUser = {
  id: string | number;
  name?: string | null;
  email: string;
  role?: string | null;
};

/**
 * Extracts a user-friendly error message from a Supabase AuthApiError or generic Error.
 * @param error The error object from a Supabase auth operation.
 * @returns A string message suitable for display to the user.
 */
export function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof AuthApiError) {
    const msg = error.message || '';
    switch (msg) {
      case 'Invalid login credentials':
      case 'Invalid email or password':
        return 'Invalid email or password. Please try again.';
      case 'User already registered':
        return 'An account with this email already exists. Please log in.';
      case 'Email not confirmed':
        return 'Please check your inbox to confirm your email address.';
      case 'Email rate limit exceeded':
        return 'Too many requests. Please try again in a few minutes.';
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.';
      default: {
        const formatted = msg.charAt(0).toUpperCase() + msg.slice(1);
        return formatted.endsWith('.') ? formatted : `${formatted}.`;
      }
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}
