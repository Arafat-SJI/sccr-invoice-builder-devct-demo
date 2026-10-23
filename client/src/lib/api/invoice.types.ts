export type CustomerLite = {
  id: string;
  name: string;
  email?: string | null;
};

export type InvoiceLineItemInput = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type CreateInvoicePayload = {
  customerId: string;
  issueDate: string; // ISO
  dueDate: string; // ISO
  discountPercentage: number;
  taxPercentage: number;
  notes?: string;
  items: InvoiceLineItemInput[];
};

export type CreatedInvoice = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  status: string;
  amount: string | number;
  createdAt?: string;
  // other fields may exist
};
