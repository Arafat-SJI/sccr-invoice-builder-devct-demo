"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCustomer, updateCustomer } from '@/lib/api/customers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  addressLine1: z.string().optional().or(z.literal('')),
  addressLine2: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export default function EditCustomerPage() {
  const params = useParams();
  const id = (params as any)?.id as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getCustomer(id);
        reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          addressLine1: data.addressLine1 || '',
          addressLine2: data.addressLine2 || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          country: data.country || '',
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to load customer');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, reset]);

  async function onSubmit(values: FormValues) {
    try {
      await updateCustomer(id, values as any);
      router.push('/dashboard/customers');
    } catch (err: any) {
      alert('Failed to update customer: ' + (err?.message || 'unknown'));
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Edit Customer</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input {...register('name')} />
          {errors.name && <div className="text-sm text-red-600">{errors.name.message}</div>}
        </div>

        <div>
          <Label>Email</Label>
          <Input {...register('email')} />
          {errors.email && <div className="text-sm text-red-600">{errors.email.message}</div>}
        </div>

        <div>
          <Label>Phone</Label>
          <Input {...register('phone')} />
        </div>

        <div>
          <Label>Address Line 1</Label>
          <Input {...register('addressLine1')} />
        </div>

        <div>
          <Label>Address Line 2</Label>
          <Input {...register('addressLine2')} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>City</Label>
            <Input {...register('city')} />
          </div>
          <div>
            <Label>State</Label>
            <Input {...register('state')} />
          </div>
          <div>
            <Label>ZIP</Label>
            <Input {...register('zipCode')} />
          </div>
        </div>

        <div>
          <Label>Country</Label>
          <Input {...register('country')} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
          <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
