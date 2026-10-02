"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

export function CustomerForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void> | void;
  submitting?: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial as any,
  });

  return (
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
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
      </div>
    </form>
  );
}
