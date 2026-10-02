"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listCustomers, deleteCustomer } from '@/lib/api/customers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { DeleteCustomerDialog } from '@/components/customers/DeleteCustomerDialog';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDeleteConfirmed(id: string) {
    setDeletingId(id);
    try {
      await deleteCustomer(id);
      await load();
    } catch (err: any) {
      alert('Delete failed: ' + (err?.message || 'unknown'));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Link href="/dashboard/customers/create">
          <Button>Add Customer</Button>
        </Link>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && customers && customers.length === 0 && (
        <Card className="p-6">
          <p className="mb-4">You have no customers yet.</p>
          <div>
            <Link href="/dashboard/customers/create">
              <Button>Add your first customer</Button>
            </Link>
          </div>
        </Card>
      )}

      {!loading && customers && customers.length > 0 && (
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
                <DeleteCustomerDialog
                  customer={c}
                  onConfirm={() => onDeleteConfirmed(c.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
