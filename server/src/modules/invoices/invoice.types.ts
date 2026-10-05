export type InvoiceItemInput = {
  description: string;
  quantity: number;
  unitPrice: number; // frontend accepts number; backend converts to Decimal if using Prisma
};

export type InvoiceItem = InvoiceItemInput & {
  id: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'VOID';

export type Invoice = {
  id: string;
  userId: string;
  customerId: string;
  invoiceNumber: string;
  issueDate?: string | null;
  dueDate?: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string | null;
  status: InvoiceStatus;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
};

export type CreateInvoiceDTO = {
  customerId: string;
  items: InvoiceItemInput[];
  issueDate?: string | null;
  dueDate?: string | null;
  discount?: number;
  tax?: number;
  notes?: string | null;
};
