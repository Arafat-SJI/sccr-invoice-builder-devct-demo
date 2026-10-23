"use client";

import React from "react";

export type LineItemDraft = {
  description: string;
  quantity: number;
  unitPrice: number;
};

function ItemRow({ index, item, onChange, onRemove }: {
  index: number;
  item: LineItemDraft;
  onChange: (patch: Partial<LineItemDraft>) => void;
  onRemove: () => void;
}) {
  const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
  return (
    <div className="grid grid-cols-12 items-start gap-2 rounded-md border border-border bg-card p-3">
      <div className="col-span-12 md:col-span-5">
        <label className="mb-1 block text-xs font-medium">Description</label>
        <input
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring"
          placeholder="Item description"
          value={item.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
      <div className="col-span-6 md:col-span-2">
        <label className="mb-1 block text-xs font-medium">Quantity</label>
        <input
          type="number"
          min={0}
          step={1}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring"
          value={item.quantity}
          onChange={(e) => onChange({ quantity: Number(e.target.value) })}
        />
      </div>
      <div className="col-span-6 md:col-span-2">
        <label className="mb-1 block text-xs font-medium">Unit Price</label>
        <input
          type="number"
          min={0}
          step={0.01}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring"
          value={item.unitPrice}
          onChange={(e) => onChange({ unitPrice: Number(e.target.value) })}
        />
      </div>
      <div className="col-span-8 md:col-span-2">
        <label className="mb-1 block text-xs font-medium">Line Total</label>
        <div className="w-full rounded-md border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-900">
          {Number.isFinite(lineTotal) ? lineTotal.toFixed(2) : "-"}
        </div>
      </div>
      <div className="col-span-4 flex items-end justify-end md:col-span-1">
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove line item ${index + 1}`}
          className="inline-flex h-9 items-center justify-center rounded-md border border-destructive bg-destructive/10 px-2 text-xs font-medium text-destructive hover:bg-destructive/20"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export function LineItemEditor({ items, onChange }: { items: LineItemDraft[]; onChange: (items: LineItemDraft[]) => void }) {
  const addItem = () => onChange([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  const updateAt = (idx: number, patch: Partial<LineItemDraft>) => {
    const next = items.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };
  const removeAt = (idx: number) => {
    const next = items.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <ItemRow
          key={idx}
          index={idx}
          item={it}
          onChange={(patch) => updateAt(idx, patch)}
          onRemove={() => removeAt(idx)}
        />
      ))}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent"
        >
          Add Item
        </button>
      </div>
    </div>
  );
}
