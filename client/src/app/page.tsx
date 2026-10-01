'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-hooks';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-8">Welcome to Invoice Builder!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center max-w-prose">
        This is a basic starter page for your Next.js application with Tailwind CSS and shadcn/ui configured.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <Button className="px-8 py-4 text-lg">Get Started</Button>
        <Button variant="outline" className="px-8 py-4 text-lg">Learn More</Button>
      </div>

      <div className="mt-16 w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Frontend Status</CardTitle>
            <CardDescription>Next.js, Tailwind CSS, and shadcn/ui are successfully integrated.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              You can start building your UI components using shadcn/ui and Tailwind utilities.
            </p>
            <ul className="mt-4 list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
              <li>Tailwind CSS classes are applying.</li>
              <li>Shadcn/ui Button and Card components are rendering.</li>
              <li>Dark mode toggle (via system preference) is supported.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
