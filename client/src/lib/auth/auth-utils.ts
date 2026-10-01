export type StoredUser = {
  id: string | number;
  name?: string | null;
  email: string;
  role?: string | null;
};

const TOKEN_KEY = 'ib_auth_token';
const USER_KEY = 'ib_auth_user';

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to persist token', e);
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to read token', e);
    return null;
  }
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to remove token', e);
  }
}

export function setUser(user: StoredUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to persist user', e);
  }
}

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch (e) {
    console.error('Failed to read user', e);
    return null;
  }
}

export function removeUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Failed to remove user', e);
  }
}
