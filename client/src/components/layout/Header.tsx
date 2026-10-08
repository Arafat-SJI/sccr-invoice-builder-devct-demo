'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-hooks';

export function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const displayName = (() => {
    const meta: any = user?.user_metadata ?? {};
    return meta.full_name || user?.email || '';
  })();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          <span className="hidden sm:inline">Invoice Builder</span>
        </Link>
        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="mr-2 hidden max-w-[12rem] truncate text-sm text-muted-foreground sm:inline">
                {displayName}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="secondary" size="sm" onClick={() => logout()} disabled={isLoading}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
