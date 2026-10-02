"use client";

import * as React from 'react';
import { InvoiceItemInput } from '@/types/invoice';

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export default function InvoiceSummary({ items, discount = 0, tax = 0 }: {
  items: InvoiceItemInput[];
  discount?: number;
  tax?: number;
}) {
  const subtotal = round2(items.reduce((s, it) => s + (it.quantity || 0) * (it.unitPrice || 0), 0));
  const total = round2(subtotal - (discount || 0) + (tax || 0));

  return (
    <div className="border p-4 rounded-md">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">Discount</span>
        <span className="font-medium">-${(discount || 0).toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">Tax</span>
        <span className="font-medium">+${(tax || 0).toFixed(2)}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between">
        <span className="text-sm">Total</span>
        <span className="text-lg font-semibold">${total.toFixed(2)}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Note: Final totals are calculated on the server.</p>
    </div>
  );
}
