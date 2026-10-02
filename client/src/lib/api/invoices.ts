import { CreateInvoiceInput, InvoiceOutput } from '@/types/invoice';

export async function createInvoice(payload: CreateInvoiceInput): Promise<InvoiceOutput> {
  const res = await fetch('/api/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || text);
    } catch (e) {
      throw new Error(text || 'Failed to create invoice');
    }
  }

  const data = await res.json();
  return data as InvoiceOutput;
}
