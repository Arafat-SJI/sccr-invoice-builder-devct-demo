export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'VOID';

export type CreateInvoiceItemPayload = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type CreateInvoicePayload = {
  customerId: string;
  invoiceDate: string; // ISO date string
  dueDate: string; // ISO date string
  items: CreateInvoiceItemPayload[];
  discount: number;
  tax: number;
  notes?: string;
  status: InvoiceStatus;
};
