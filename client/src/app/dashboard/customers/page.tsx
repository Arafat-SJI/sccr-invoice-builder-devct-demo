"use client";

import { useEffect, useState } from 'react';
import { fetchCustomers } from '@/lib/api/customers';
import CustomerList from '@/components/customers/CustomerList';
import { Button } from '@/components/ui/button';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading customers: {error?.message || 'Unknown error'}</div>;
  if (customers.length === 0) return <div>No customers found. <Button>Create Customer</Button></div>;

  return <CustomerList customers={customers} />;
}
