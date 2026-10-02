"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DeleteCustomerDialog } from './DeleteCustomerDialog';

export function CustomerList({ customers = [], onDelete }: { customers: any[]; onDelete: (id: string) => void; }) {
  if (!customers || customers.length === 0) {
    return (
      <Card className="p-6">
        <p className="mb-4">You have no customers yet.</p>
        <div>
          <Link href="/dashboard/customers/create">
            <Button>Add your first customer</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {customers.map((c) => (
        <Card key={c.id} className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-muted-foreground">{c.email || 'No email'}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/customers/${c.id}`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
            <DeleteCustomerDialog customer={c} onConfirm={() => onDelete(c.id)} />
          </div>
        </Card>
      ))}
    </div>
  );
}
