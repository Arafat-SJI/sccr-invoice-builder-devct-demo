"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Simple id generator to avoid adding a new dependency (uuid) to the project
const generateId = () => {
  try {
    // prefer crypto.randomUUID when available
    if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
      return (crypto as any).randomUUID();
    }
  } catch (_e) {
    // ignore
  }
  return `id_${Math.random().toString(36).slice(2, 9)}`;
};

// Frontend DTOs (kept local here to avoid creating more files)
const LineItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.preprocess((v) => Number(v), z.number().positive("Quantity must be greater than 0")),
  unitPrice: z.preprocess((v) => Number(v), z.number().nonnegative("Unit price must be 0 or greater")),
});

const InvoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  issueDate: z.string().refine((s) => Boolean(Date.parse(s)), "Invalid date"),
  dueDate: z.string().refine((s) => Boolean(Date.parse(s)), "Invalid date"),
  discount: z.preprocess((v) => (v === "" ? 0 : Number(v)), z.number().min(0, "Discount cannot be negative")),
  tax: z.preprocess((v) => (v === "" ? 0 : Number(v)), z.number().min(0, "Tax cannot be negative")),
  notes: z.string().optional(),
  items: z.array(LineItemSchema).min(1, "At least one line item is required"),
});

type InvoiceFormValues = z.infer<typeof InvoiceSchema>;

function defaults(): InvoiceFormValues {
  return {
    customerId: "",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    discount: 0,
    tax: 0,
    notes: "",
    items: [
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ],
  };
}

export default function InvoiceForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: defaults(),
    mode: "onBlur",
  });

  // Items are stored in form state (array)
  const items = watch("items");
  const discount = watch("discount") ?? 0;
  const tax = watch("tax") ?? 0;

  // Calculations
  const subtotal = useMemo(() => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  }, [items]);

  const total = useMemo(() => {
    const disc = Number(discount) || 0;
    const t = Number(tax) || 0;
    return Math.max(0, subtotal - disc + t);
  }, [subtotal, discount, tax]);

  // Helpers to manage items
  const addItem = useCallback(() => {
    const newItem = { id: generateId(), description: "", quantity: 1, unitPrice: 0 };
    const next = Array.isArray(items) ? [...items, newItem] : [newItem];
    setValue("items", next, { shouldValidate: true, shouldDirty: true });
  }, [items, setValue]);

  const removeItem = useCallback(
    (id?: string, idx?: number) => {
      const next = (Array.isArray(items) ? items : []).filter((it, i) => (id ? it.id !== id : i !== idx));
      setValue("items", next, { shouldValidate: true, shouldDirty: true });
    },
    [items, setValue]
  );

  // Update a specific field for an item
  const updateItemField = useCallback(
    (index: number, field: keyof InvoiceFormValues["items"][number], value: any) => {
      const next = Array.isArray(items) ? [...items] : [];
      const it = next[index] || { id: generateId(), description: "", quantity: 1, unitPrice: 0 } as any;
      // ensure numbers are numbers
      if (field === "quantity" || field === "unitPrice") {
        // allow empty string -> set to 0
        (it as any)[field] = value === "" ? 0 : Number(value);
      } else {
        (it as any)[field] = value;
      }
      next[index] = it;
      setValue("items", next, { shouldValidate: true, shouldDirty: true });
    },
    [items, setValue]
  );

  // Prevent double submissions
  async function onSubmit(data: InvoiceFormValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
      const resp = await fetch(`${API_URL}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerId: data.customerId,
          items: data.items.map((it) => ({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice })),
          // status left as default on server (DRAFT) — frontend could send status if needed
          notes: data.notes,
        }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        const message = body?.message || `Failed to create invoice (${resp.status})`;
        alert(message);
        setIsSubmitting(false);
        return;
      }

      await resp.json();
      // Redirect to invoice list or detail page if available
      router.push("/dashboard/invoices");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while creating the invoice.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Small client-only validation UI: show errors per line item
  useEffect(() => {
    // ensure at least one item exists in the form initially
    if (!Array.isArray(items) || items.length === 0) {
      setValue("items", [{ id: generateId(), description: "", quantity: 1, unitPrice: 0 }], { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-md shadow-sm">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Customer ID</label>
          <input
            {...register("customerId")}
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="Enter customer id or reference"
          />
          {errors.customerId && <p className="text-sm text-red-600 mt-1">{errors.customerId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Issue Date</label>
            <input type="date" {...register("issueDate")} className="mt-1 block w-full rounded border px-3 py-2" />
            {errors.issueDate && <p className="text-sm text-red-600 mt-1">{errors.issueDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input type="date" {...register("dueDate")} className="mt-1 block w-full rounded border px-3 py-2" />
            {errors.dueDate && <p className="text-sm text-red-600 mt-1">{errors.dueDate.message}</p>}
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-medium mb-2">Line Items</h3>
        <div className="space-y-3">
          {Array.isArray(items) && items.map((it: any, index: number) => {
            const itemTotal = (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0);
            return (
              <div key={it.id ?? index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-sm">Description</label>
                  <input
                    value={it.description}
                    onChange={(e) => updateItemField(index, "description", e.target.value)}
                    className="mt-1 block w-full rounded border px-3 py-2"
                    placeholder="Item description"
                  />
                </div>

                <div className="col-span-6 md:col-span-2">
                  <label className="block text-sm">Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={it.quantity}
                    onChange={(e) => updateItemField(index, "quantity", e.target.value)}
                    className="mt-1 block w-full rounded border px-3 py-2"
                  />
                </div>

                <div className="col-span-6 md:col-span-2">
                  <label className="block text-sm">Unit Price</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={it.unitPrice}
                    onChange={(e) => updateItemField(index, "unitPrice", e.target.value)}
                    className="mt-1 block w-full rounded border px-3 py-2"
                  />
                </div>

                <div className="col-span-6 md:col-span-1">
                  <label className="block text-sm">Total</label>
                  <div className="mt-1">
                    <input value={itemTotal.toFixed(2)} readOnly className="w-full rounded border px-3 py-2 bg-gray-50" />
                  </div>
                </div>

                <div className="col-span-6 md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(it.id, index)}
                    className="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:underline"
                    aria-label={`Remove item ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>

                {/* Show validation errors for this item if present (best-effort) */}
                {errors.items && Array.isArray(errors.items) && (errors.items as any)[index] && (
                  <div className="col-span-12 text-sm text-red-600">{(errors.items as any)[index]?.message || "Invalid item"}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3">
          <button type="button" onClick={addItem} className="inline-flex items-center rounded bg-primary px-3 py-2 text-white">
            + Add Item
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Notes</label>
          <textarea {...register("notes")} className="mt-1 block w-full rounded border px-3 py-2" rows={4} />
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Discount</label>
              <input type="number" step="0.01" min={0} {...(register("discount") as any)} className="mt-1 block w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm">Tax</label>
              <input type="number" step="0.01" min={0} {...(register("tax") as any)} className="mt-1 block w-full rounded border px-3 py-2" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm">Subtotal</label>
              <input value={subtotal.toFixed(2)} readOnly className="mt-1 block w-full rounded border px-3 py-2 bg-gray-50 font-medium" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm">Total</label>
              <input value={total.toFixed(2)} readOnly className="mt-1 block w-full rounded border px-3 py-2 bg-gray-100 text-lg font-semibold" />
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 rounded ${isSubmitting ? "bg-gray-400 text-white" : "bg-green-600 text-white hover:bg-green-700"}`}
        >
          {isSubmitting ? "Saving…" : "Save Invoice"}
        </button>
      </div>
    </form>
  );
}
