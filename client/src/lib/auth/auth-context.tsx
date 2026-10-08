'use client';

import { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { getSupabaseErrorMessage } from '@/lib/auth/auth-utils';

export type AuthContextType = {
  user: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ emailConfirmationRequired: boolean }>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
  initialSession = null,
}: {
  children: ReactNode;
  initialUser?: SupabaseUser | null;
  initialSession?: Session | null;
}) {
  const [user, setUser] = useState<SupabaseUser | null>(initialUser);
  const [session, setSession] = useState<Session | null>(initialSession);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!session?.user?.id;

  // Initialize on client from Supabase
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(sessionData.session ?? null);
        setUser(sessionData.session?.user ?? null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session ?? null);
      setUser(data.user ?? data.session?.user ?? null);
      router.push('/');
    } catch (err) {
      throw new Error(getSupabaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const register = useCallback(async ({ name, email, password }: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      if (error) throw error;

      // If session is returned, user is signed in immediately
      if (data.session) {
        setSession(data.session);
        setUser(data.user ?? data.session.user);
        router.push('/');
        return { emailConfirmationRequired: false };
      }

      // Otherwise, email confirmation is required
      setSession(null);
      setUser(data.user ?? null);
      return { emailConfirmationRequired: true };
    } catch (err) {
      throw new Error(getSupabaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      // Even if signOut throws, clear client state to avoid being stuck
    } finally {
      setSession(null);
      setUser(null);
      router.push('/');
      setIsLoading(false);
    }
  }, [router]);

  // Client-side redirect behavior for auth routes
  useEffect(() => {
    if (isLoading) return;
    const authRoutes = ['/login', '/register'];
    if (isAuthenticated && authRoutes.includes(pathname)) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  }), [user, session, isAuthenticated, isLoading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
