'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Receipt, Users, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';

const features = [
  {
    icon: Receipt,
    title: 'Professional invoices',
    description: 'Create polished invoices with line items, taxes, and status tracking.',
  },
  {
    icon: Users,
    title: 'Customer directory',
    description: 'Keep contact details organized and reuse them on every invoice.',
  },
  {
    icon: Zap,
    title: 'Fast workflow',
    description: 'Sign in once and manage everything from a single dashboard.',
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <PageContainer centered={false} className="mx-auto max-w-6xl py-12 sm:py-16 lg:py-20">
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Invoice Builder
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Send invoices your clients actually want to pay
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            A clean, focused workspace for freelancers and small teams—customers, invoices, and
            auth ready out of the box.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <Card className="border-primary/20 bg-card/80 shadow-lg">
          <CardHeader>
            <CardTitle>Everything in one place</CardTitle>
            <CardDescription>
              Built with Next.js, Tailwind, and a consistent design system—light and dark mode
              included.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4 rounded-lg border bg-background/60 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
