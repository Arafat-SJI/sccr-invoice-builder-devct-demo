export interface Invoice {
  id: string;
  userId: string;
  customerId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoicePayload {
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  discount: number;
  tax: number;
  notes?: string;
}

export interface CustomerMinimal {
  id: string;
  name: string;
}
