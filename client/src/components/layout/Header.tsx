'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-hooks';

export function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
        Invoice Builder
      </Link>
      <nav className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">{user?.name || user?.email}</span>
            <Link href="/dashboard"><Button variant="ghost">Dashboard</Button></Link>
            <Button onClick={() => logout()} variant="outline" disabled={isLoading}>Logout</Button>
          </>
        ) : (
          <Link href="/login"><Button variant="ghost">Login</Button></Link>
        )}
      </nav>
    </header>
  );
}
