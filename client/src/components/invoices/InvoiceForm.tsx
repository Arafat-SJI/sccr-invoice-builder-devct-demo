"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { CreateInvoiceDto, Invoice } from '@/lib/api/invoice.types';
import { createInvoice } from '@/lib/api/invoices';
import { getCustomers } from '@/lib/api/customers';

type Props = {
  onCreated?: (invoice: Invoice) => void;
};

type Customer = {
  id: string;
  name: string;
  email?: string;
};

export default function InvoiceForm({ onCreated }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerId, setCustomerId] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState(
    [
      { description: '', quantity: 1, unitPrice: 0 },
    ] as CreateInvoiceDto['items']
  );

  useEffect(() => {
    let mounted = true;
    setLoadingCustomers(true);
    getCustomers()
      .then((data) => {
        if (mounted) setCustomers(data || []);
      })
      .catch(() => {
        if (mounted) setCustomers([]);
      })
      .finally(() => {
        if (mounted) setLoadingCustomers(false);
      });
    return () => { mounted = false; };
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.quantity || 0) * (it.unitPrice || 0), 0);
  }, [items]);

  const total = useMemo(() => {
    return subtotal - (discount || 0) + (tax || 0);
  }, [subtotal, discount, tax]);

  function setItemAt(index: number, patch: Partial<CreateInvoiceDto['items'][number]>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);

    // Client-side validation
    if (!customerId) return setError('Please select a customer');
    if (!items || items.length === 0) return setError('Add at least one invoice item');
    for (const it of items) {
      if (!it.description || it.description.trim() === '') return setError('All items must have a description');
      if (!Number.isFinite(it.quantity) || it.quantity < 1) return setError('Quantity must be at least 1');
      if (!Number.isFinite(it.unitPrice) || it.unitPrice < 0) return setError('Unit price must be 0 or greater');
    }

    const payload: CreateInvoiceDto = {
      customerId,
      items,
      issueDate: issueDate || undefined,
      dueDate: dueDate || undefined,
      discount: discount || 0,
      tax: tax || 0,
      notes: notes || undefined,
    };

    try {
      setSubmitting(true);
      const created = await createInvoice(payload);
      if (onCreated) onCreated(created);
    } catch (err: any) {
      // Show friendly message
      if (err?.message) setError(err.message);
      else if (err?.errors) setError(JSON.stringify(err.errors));
      else setError('Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-2 bg-red-100 text-red-800 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Customer</label>
          <select
            className="w-full border rounded p-2"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            disabled={loadingCustomers}
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}{c.email ? ` — ${c.email}` : ''}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Issue date</label>
            <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border rounded p-2" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Items</h3>
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-8 gap-2 items-end">
              <div className="col-span-4">
                <label className="text-sm">Description</label>
                <input className="w-full border rounded p-2" value={it.description} onChange={(e) => setItemAt(idx, { description: e.target.value })} />
              </div>
              <div className="col-span-1">
                <label className="text-sm">Qty</label>
                <input type="number" min={1} className="w-full border rounded p-2" value={it.quantity} onChange={(e) => setItemAt(idx, { quantity: Number(e.target.value) })} />
              </div>
              <div className="col-span-2">
                <label className="text-sm">Unit price</label>
                <input type="number" min={0} step="0.01" className="w-full border rounded p-2" value={it.unitPrice} onChange={(e) => setItemAt(idx, { unitPrice: Number(e.target.value) })} />
              </div>
              <div className="col-span-1 text-right">
                <div className="text-sm">{(it.quantity * it.unitPrice).toFixed(2)}</div>
                <div>
                  <button type="button" className="text-xs text-red-600 mt-1" onClick={() => removeItem(idx)} disabled={items.length === 1}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <button type="button" onClick={addItem} className="px-3 py-1 bg-muted rounded">Add Item</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea className="w-full border rounded p-2" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}></textarea>
        </div>
        <div className="p-4 border rounded">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between mt-2 items-center">
            <label className="text-sm mr-2">Discount</label>
            <input type="number" step="0.01" min={0} className="w-32 border rounded p-1" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </div>
          <div className="flex justify-between mt-2 items-center">
            <label className="text-sm mr-2">Tax</label>
            <input type="number" step="0.01" min={0} className="w-32 border rounded p-1" value={tax} onChange={(e) => setTax(Number(e.target.value))} />
          </div>
          <div className="flex justify-between mt-4 font-semibold"> <span>Total</span> <span>${total.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50">
          {submitting ? 'Creating...' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
}
