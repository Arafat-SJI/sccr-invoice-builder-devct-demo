export type InvoiceItemInput = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type CreateInvoiceInput = {
  customerId: string;
  issueDate?: string;
  dueDate?: string;
  items: InvoiceItemInput[];
  discount?: number;
  tax?: number;
  notes?: string;
};

export type InvoiceItemOutput = {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number | string;
  unitPrice: number | string;
  amount: number | string;
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
  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  total: number | string;
  notes?: string | null;
  status: string;
  items: InvoiceItemOutput[];
  createdAt: string;
  updatedAt: string;
};
