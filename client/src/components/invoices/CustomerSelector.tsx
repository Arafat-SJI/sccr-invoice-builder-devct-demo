"use client";

import * as React from 'react';

type Props = {
  value: string | null;
  onChange: (v: string) => void;
};

export default function CustomerSelector({ value, onChange }: Props) {
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/customers', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load customers');
        const data = await res.json();
        if (!mounted) return;
        setCustomers(data || []);
      } catch (e: any) {
        setError(e.message || 'Failed to load customers');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Loading customers…</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;

  return (
    <select
      className="input w-full"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select a customer…</option>
      {customers.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} {c.email ? `(${c.email})` : ''}
        </option>
      ))}
    </select>
  );
}
