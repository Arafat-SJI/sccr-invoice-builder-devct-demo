'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-hooks';
import type { ApiError } from '@/lib/api/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setApiError(null);
    try {
      await login(data);
    } catch (err: any) {
      const e = (err || {}) as ApiError;
      if (e.errors) {
        Object.entries(e.errors).forEach(([field, message]) => {
          const msg = Array.isArray(message) ? message.join(', ') : message;
          if (field in data) {
            setError(field as keyof LoginFormInputs, { type: 'server', message: msg });
          }
        });
      }
      setApiError(e.message || 'Invalid credentials.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email and password to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" disabled={isLoading} {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" disabled={isLoading} {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Login'}
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">Create one</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
