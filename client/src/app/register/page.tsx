'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-hooks';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { PageContainer } from '@/components/layout/PageContainer';

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <RegisterForm />
    </PageContainer>
  );
}
