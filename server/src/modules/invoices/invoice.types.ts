import { Decimal } from '@prisma/client/runtime/library';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'VOID';

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: Decimal;
  amount: Decimal;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  customerId: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: Decimal;
  discount: Decimal;
  tax: Decimal;
  total: Decimal;
  notes: string | null;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;
  items?: InvoiceItem[]; // Optional for some queries
}

export interface CreateInvoiceItemDTO {
  description: string;
  quantity: number;
  unitPrice: number; // Use number for input, convert to Decimal in service/repo
}

export interface CreateInvoiceDTO {
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  items: CreateInvoiceItemDTO[];
  discount?: number;
  tax?: number;
  notes?: string;
  status?: InvoiceStatus;
}

export interface UpdateInvoiceItemDTO extends Partial<CreateInvoiceItemDTO> {}

export interface UpdateInvoiceDTO extends Partial<Omit<CreateInvoiceDTO, 'items'>> {
  items?: (UpdateInvoiceItemDTO & { id?: string })[]; // Allow updating existing items or adding new ones
}
