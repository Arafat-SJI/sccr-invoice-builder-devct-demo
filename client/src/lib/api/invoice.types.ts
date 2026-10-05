export type InvoiceItemInput = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type CreateInvoiceDto = {
  customerId: string;
  items: InvoiceItemInput[];
  issueDate?: string | null;
  dueDate?: string | null;
  discount?: number;
  tax?: number;
  notes?: string | null;
};

export type InvoiceItem = InvoiceItemInput & {
  id: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

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
  status: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
};
