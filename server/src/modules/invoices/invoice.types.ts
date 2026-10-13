export interface Invoice {
  id: string;
  userId: string;
  customerId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'VOID';
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoicePayload {
  customerId: string;
  invoiceDate: Date;
  dueDate: Date;
  items: CreateInvoiceItemPayload[];
  discount: number;
  tax: number;
  notes?: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'VOID';
}

export interface CreateInvoiceItemPayload {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateInvoicePayload extends Partial<CreateInvoicePayload> {}
