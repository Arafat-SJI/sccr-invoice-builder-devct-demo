'use client';

import { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { User, LoginData, RegisterData } from '@/lib/api/auth';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '@/lib/api/auth';
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/lib/auth/auth-utils';

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!token && !!user;

  // Initialize from localStorage
  useEffect(() => {
    const init = () => {
      try {
        const savedToken = getToken();
        const savedUser = getUser();
        if (savedToken) setTokenState(savedToken);
        if (savedUser) setUserState(savedUser as User);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const doLogin = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    try {
      const { token: tk, user: usr } = await apiLogin(data);
      setToken(tk);
      setUser(usr);
      setTokenState(tk);
      setUserState(usr);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const doRegister = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const { token: tk, user: usr } = await apiRegister(data);
      setToken(tk);
      setUser(usr);
      setTokenState(tk);
      setUserState(usr);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const doLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      removeToken();
      removeUser();
      setTokenState(null);
      setUserState(null);
      router.push('/login');
      setIsLoading(false);
    }
  }, [router]);

  // Client-side route protection and redirects
  useEffect(() => {
    if (isLoading) return;
    const protectedRoutes = ['/dashboard'];
    const authRoutes = ['/login', '/register'];

    if (isAuthenticated && authRoutes.includes(pathname)) {
      router.replace('/dashboard');
    } else if (!isAuthenticated && protectedRoutes.includes(pathname)) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated,
    isLoading,
    login: doLogin,
    register: doRegister,
    logout: doLogout,
  }), [user, token, isAuthenticated, isLoading, doLogin, doRegister, doLogout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
