"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import InvoiceForm from '@/components/invoices/InvoiceForm';

export default function CreateInvoicePage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create Invoice</h1>
      <InvoiceForm
        onCreated={(invoice) => {
          // invoice.id expected
          router.push(`/dashboard/invoices/${invoice.id}`);
        }}
      />
    </div>
  );
}
