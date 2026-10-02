"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import CustomerSelector from '@/components/invoices/CustomerSelector';
import InvoiceItemsEditor from '@/components/invoices/InvoiceItemsEditor';
import InvoiceSummary from '@/components/invoices/InvoiceSummary';
import { createInvoice } from '@/lib/api/invoices';
import { CreateInvoiceInput, InvoiceItemInput } from '@/types/invoice';

export default function InvoiceBuilderForm() {
  const router = useRouter();
  const [customerId, setCustomerId] = React.useState<string | null>(null);
  const [issueDate, setIssueDate] = React.useState<string>(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = React.useState<string>(new Date().toISOString().slice(0, 10));
  const [items, setItems] = React.useState<InvoiceItemInput[]>([
    { description: '', quantity: 1, unitPrice: 0 },
  ]);
  const [discount, setDiscount] = React.useState<number>(0);
  const [tax, setTax] = React.useState<number>(0);
  const [notes, setNotes] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAddItem = React.useCallback(() => {
    setItems((s) => [...s, { description: '', quantity: 1, unitPrice: 0 }]);
  }, []);

  const handleRemoveItem = React.useCallback((index: number) => {
    setItems((s) => s.filter((_, i) => i !== index));
  }, []);

  const handleItemChange = React.useCallback((index: number, next: InvoiceItemInput) => {
    setItems((s) => s.map((it, i) => (i === index ? next : it)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerId) {
      setError('Please select a customer.');
      return;
    }

    if (!items || items.length === 0) {
      setError('At least one invoice item is required.');
      return;
    }

    setLoading(true);
    try {
      const payload: CreateInvoiceInput = {
        customerId: customerId,
        issueDate,
        dueDate,
        items,
        discount,
        tax,
        notes,
      };

      const created = await createInvoice(payload);
      // redirect to invoice details
      router.push(`/dashboard/invoices/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-sm text-destructive">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Customer</label>
        <CustomerSelector value={customerId} onChange={(v) => setCustomerId(v)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Issue date</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input"
          />
        </div>
      </div>

      <InvoiceItemsEditor
        items={items}
        onAdd={handleAddItem}
        onRemove={handleRemoveItem}
        onChange={handleItemChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Discount</label>
          <input
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tax</label>
          <input
            type="number"
            step="0.01"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="textarea"
          rows={4}
        />
      </div>

      <InvoiceSummary items={items} discount={discount} tax={tax} />

      <div className="flex items-center gap-3">
        <button
          disabled={loading}
          type="submit"
          className="btn btn-primary"
        >
          {loading ? 'Saving…' : 'Save Invoice'}
        </button>
      </div>
    </form>
  );
}
