"use client";

import * as React from 'react';
import { InvoiceItemInput } from '@/types/invoice';

type Props = {
  items: InvoiceItemInput[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, item: InvoiceItemInput) => void;
};

export default function InvoiceItemsEditor({ items, onAdd, onRemove, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium">Items</h2>
        <button type="button" onClick={onAdd} className="btn btn-ghost text-sm">
          + Add item
        </button>
      </div>
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-center">
            <input
              className="col-span-6 input"
              placeholder="Description"
              value={it.description}
              onChange={(e) => onChange(idx, { ...it, description: e.target.value })}
            />
            <input
              type="number"
              step="0.01"
              className="col-span-2 input"
              value={String(it.quantity)}
              onChange={(e) => onChange(idx, { ...it, quantity: Number(e.target.value) })}
            />
            <input
              type="number"
              step="0.01"
              className="col-span-2 input"
              value={String(it.unitPrice)}
              onChange={(e) => onChange(idx, { ...it, unitPrice: Number(e.target.value) })}
            />
            <div className="col-span-2 flex gap-2">
              <button type="button" onClick={() => onRemove(idx)} className="btn btn-outline">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
