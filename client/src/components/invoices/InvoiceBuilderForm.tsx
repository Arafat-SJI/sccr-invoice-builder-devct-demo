"use client";

import React from "react";
import { CustomerSelector } from "@/components/invoices/CustomerSelector";
import { LineItemEditor, LineItemDraft } from "@/components/invoices/LineItemEditor";
import { InvoiceSummary } from "@/components/invoices/InvoiceSummary";
import { createInvoice } from "@/lib/api/invoices";
import type { CreateInvoicePayload } from "@/lib/api/invoice.types";

function formatCurrency(value: number, currency: string = "USD") {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
}

export default function InvoiceBuilderForm() {
  const [customerId, setCustomerId] = React.useState<string>("");
  const [issueDate, setIssueDate] = React.useState<string>("");
  const [dueDate, setDueDate] = React.useState<string>("");
  const [discountPercentage, setDiscountPercentage] = React.useState<number>(0);
  const [taxPercentage, setTaxPercentage] = React.useState<number>(0);
  const [notes, setNotes] = React.useState<string>("");
  const [items, setItems] = React.useState<LineItemDraft[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Derived totals
  const subtotal = React.useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  }, [items]);

  const discountAmount = React.useMemo(() => (subtotal * (Number(discountPercentage) || 0)) / 100, [subtotal, discountPercentage]);
  const taxable = React.useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);
  const taxAmount = React.useMemo(() => (taxable * (Number(taxPercentage) || 0)) / 100, [taxable, taxPercentage]);
  const grandTotal = React.useMemo(() => subtotal - discountAmount + taxAmount, [subtotal, discountAmount, taxAmount]);

  function validate(): string | null {
    if (!customerId) return "Please select a customer.";
    if (!issueDate) return "Please choose an issue date.";
    if (!dueDate) return "Please choose a due date.";
    const issue = new Date(issueDate);
    const due = new Date(dueDate);
    if (Number.isFinite(issue.getTime()) && Number.isFinite(due.getTime())) {
      if (due < issue) return "Due date cannot be earlier than issue date.";
    }
    if (!items.length) return "Please add at least one line item.";
    for (const [idx, it] of items.entries()) {
      if (!it.description?.trim()) return `Line item #${idx + 1} is missing a description.`;
      if (!Number.isFinite(Number(it.quantity)) || Number(it.quantity) <= 0) return `Line item #${idx + 1} must have quantity > 0.`;
      if (!Number.isFinite(Number(it.unitPrice)) || Number(it.unitPrice) < 0) return `Line item #${idx + 1} has an invalid unit price.`;
    }
    if (!Number.isFinite(Number(discountPercentage)) || Number(discountPercentage) < 0) return "Discount must be 0 or greater.";
    if (!Number.isFinite(Number(taxPercentage)) || Number(taxPercentage) < 0) return "Tax must be 0 or greater.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    const payload: CreateInvoicePayload = {
      customerId,
      issueDate: new Date(issueDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      discountPercentage: Number(discountPercentage) || 0,
      taxPercentage: Number(taxPercentage) || 0,
      notes: notes?.trim() || undefined,
      items: items.map((it) => ({
        description: it.description.trim(),
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
      })),
      // Server currently handles totals; we compute on UI for display
    };

    try {
      setSubmitting(true);
      await createInvoice(payload);
      setSuccess("Invoice created successfully.");
      // Reset the form
      setCustomerId("");
      setIssueDate("");
      setDueDate("");
      setDiscountPercentage(0);
      setTaxPercentage(0);
      setNotes("");
      setItems([{ description: "", quantity: 1, unitPrice: 0 }]);
    } catch (e: any) {
      const message = e?.message || "Failed to create invoice.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Customer & Dates */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium">Customer</label>
          <CustomerSelector value={customerId} onChange={setCustomerId} />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="issueDate" className="mb-1 block text-sm font-medium">Issue Date</label>
          <input
            id="issueDate"
            type="date"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <label htmlFor="dueDate" className="mb-1 block text-sm font-medium">Due Date</label>
          <input
            id="dueDate"
            type="date"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </section>

      {/* Line Items */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-medium">Line Items</h2>
          <p className="text-xs text-muted-foreground">Add at least one item</p>
        </div>
        <LineItemEditor items={items} onChange={setItems} />
      </section>

      {/* Discount & Tax & Notes */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="discount" className="mb-1 block text-sm font-medium">Discount %</label>
          <input
            id="discount"
            type="number"
            min={0}
            step={0.01}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="tax" className="mb-1 block text-sm font-medium">Tax %</label>
          <input
            id="tax"
            type="number"
            min={0}
            step={0.01}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring"
            value={taxPercentage}
            onChange={(e) => setTaxPercentage(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-medium">Notes</label>
          <textarea
            id="notes"
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring"
            placeholder="Optional notes for this invoice"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <p className="text-sm text-muted-foreground">
            Calculated fields are shown on the right and update automatically.
          </p>
        </div>
        <div className="order-1 md:order-2">
          <InvoiceSummary
            subtotal={subtotal}
            discountPercentage={discountPercentage}
            discountAmount={discountAmount}
            taxableAmount={taxable}
            taxPercentage={taxPercentage}
            taxAmount={taxAmount}
            grandTotal={grandTotal}
            formatCurrency={formatCurrency}
          />
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
