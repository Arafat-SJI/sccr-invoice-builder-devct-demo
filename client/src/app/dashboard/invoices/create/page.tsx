"use client";

import * as React from 'react';
import InvoiceBuilderForm from '@/components/invoices/InvoiceBuilderForm';

export default function CreateInvoicePage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create Invoice</h1>
      <InvoiceBuilderForm />
    </div>
  );
}
