import type { Decimal } from '@prisma/client/runtime';

export type InvoiceItemInput = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type CreateInvoiceInput = {
  customerId: string;
  issueDate?: string; // ISO
  dueDate?: string; // ISO
  items: InvoiceItemInput[];
  discount?: number;
  tax?: number;
  notes?: string;
};

export type InvoiceItemOutput = {
  id: string;
  invoiceId: string;
  description: string;
  quantity: Decimal | string | number;
  unitPrice: Decimal | string | number;
  amount: Decimal | string | number;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceOutput = {
  id: string;
  userId: string;
  customerId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  subtotal: Decimal | string | number;
  discount: Decimal | string | number;
  tax: Decimal | string | number;
  total: Decimal | string | number;
  notes?: string | null;
  status: string;
  items: InvoiceItemOutput[];
  createdAt: string;
  updatedAt: string;
};
