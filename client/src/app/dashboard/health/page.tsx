'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/lib/auth/auth-hooks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import HealthStatusDisplay from '@/components/health/HealthStatusDisplay';
import type { HealthStatus } from '@/lib/api/health';
import { getHealth } from '@/lib/api/health';

export default function HealthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        const data = await getHealth();
        if (mounted) setHealth(data);
      } catch (err: any) {
        if (mounted) setError(err?.message ?? 'Failed to load health status');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading || loading) {
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Loading health status…</p>
      </PageContainer>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <PageContainer centered={false} className="mx-auto w-full max-w-5xl">
      <header className="mb-8 w-full space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Health</h1>
        <p className="text-muted-foreground">Live status of backend services and database connectivity.</p>
      </header>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to fetch health status</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : health ? (
        <HealthStatusDisplay data={health} />
      ) : (
        <p className="text-sm text-muted-foreground">No data available.</p>
      )}
    </PageContainer>
  );
}
