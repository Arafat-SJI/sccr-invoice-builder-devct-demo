import { randomUUID } from 'crypto';

export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'VOID';

export type Invoice = {
  id: string;
  userId: string;
  customerId?: string;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;
  invoiceNumber?: string;
  issueDate?: Date | null;
  dueDate?: Date | null;
  discount?: number;
  tax?: number;
  notes?: string | null;
};

export type CreateInvoiceDTO = {
  userId: string;
  customerId?: string;
  items?: InvoiceItem[];
  status?: InvoiceStatus;
  invoiceNumber?: string;
  issueDate?: Date | null;
  dueDate?: Date | null;
  discount?: number;
  tax?: number;
  notes?: string | null;
};

export type UpdateInvoiceDTO = Partial<Omit<Invoice, 'id' | 'userId' | 'createdAt'>>;

const invoices: Invoice[] = [];

async function findAllByUser(userId: string): Promise<Invoice[]> {
  return invoices.filter((i) => i.userId === userId);
}

async function findById(id: string): Promise<Invoice | null> {
  return invoices.find((i) => i.id === id) || null;
}

async function create(data: CreateInvoiceDTO): Promise<Invoice> {
  const now = new Date();
  const items = Array.isArray(data.items) ? data.items : [];
  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const discount = typeof data.discount === 'number' ? data.discount : 0;
  const tax = typeof data.tax === 'number' ? data.tax : 0;
  const total = subtotal - discount + tax;

  const invoice: Invoice = {
    id: randomUUID(),
    userId: data.userId,
    customerId: data.customerId,
    items,
    subtotal,
    discount,
    tax,
    total,
    invoiceNumber: data.invoiceNumber ?? `INV-${now.getTime()}`,
    issueDate: data.issueDate ?? null,
    dueDate: data.dueDate ?? null,
    notes: data.notes ?? null,
    status: data.status ?? 'DRAFT',
    createdAt: now,
    updatedAt: now,
  };
  invoices.push(invoice);
  return invoice;
}

async function update(id: string, data: UpdateInvoiceDTO): Promise<Invoice | null> {
  const index = invoices.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const current = invoices[index];
  let items = data.items ?? current.items;
  if (!Array.isArray(items)) items = current.items;

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const discount = typeof data.discount === 'number' ? data.discount : current.discount ?? 0;
  const tax = typeof data.tax === 'number' ? data.tax : current.tax ?? 0;

  const updated: Invoice = {
    ...current,
    ...data,
    items,
    subtotal,
    total: subtotal - (discount ?? 0) + (tax ?? 0),
    userId: current.userId, // do not allow changing ownership
    updatedAt: new Date(),
  };
  invoices[index] = updated;
  return updated;
}

async function remove(id: string): Promise<boolean> {
  const index = invoices.findIndex((i) => i.id === id);
  if (index === -1) return false;
  invoices.splice(index, 1);
  return true;
}

export const invoiceRepository = {
  findAllByUser,
  findById,
  create,
  update,
  remove,
};

export default invoiceRepository;
