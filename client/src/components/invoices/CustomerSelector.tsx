"use client";

import React from "react";
import { getCustomers } from "@/lib/api/invoices";
import type { CustomerLite } from "@/lib/api/invoice.types";

export function CustomerSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [customers, setCustomers] = React.useState<CustomerLite[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    getCustomers()
      .then((list) => {
        if (!mounted) return;
        setCustomers(list);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load customers.");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <select
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring disabled:cursor-not-allowed disabled:opacity-60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        aria-label="Select customer"
      >
        <option value="" disabled>
          {loading ? "Loading customers…" : error ? "Unable to load customers" : "Select a customer"}
        </option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}{c.email ? ` — ${c.email}` : ""}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
