"use client";

import React from 'react';
import { useParams } from 'next/navigation';

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params?.id ?? 'unknown';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Invoice Created</h1>
      <p className="text-sm text-muted-foreground">Invoice ID: <strong>{id}</strong></p>
      <p className="mt-4">This is a placeholder invoice details page. Full details page is implemented in a following task.</p>
    </div>
  );
}
