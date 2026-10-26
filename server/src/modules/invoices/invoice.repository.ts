import { randomUUID } from 'crypto';
import type { Invoice as PrismaInvoice } from '@prisma/client';
import prisma from '../../database/prisma';
import { InvoiceQueryParams } from './invoice.types';

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
};

export type CreateInvoiceDTO = {
  userId: string;
  customerId?: string;
  items?: InvoiceItem[];
  status?: InvoiceStatus;
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
  const invoice: Invoice = {
    id: randomUUID(),
    userId: data.userId,
    customerId: data.customerId,
    items,
    subtotal,
    total: subtotal, // simple model: total === subtotal (no tax/discounts here)
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

  const updated: Invoice = {
    ...current,
    ...data,
    items,
    subtotal,
    total: subtotal,
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

// New: Use Prisma to fetch paginated and filtered invoices owned by a user
async function findManyWithPaginationAndFilters(
  userId: string,
  query: InvoiceQueryParams,
): Promise<{ invoices: PrismaInvoice[]; totalCount: number }> {
  const { page, limit, status, customer, startDate, endDate, invoiceNumber } = query;

  const where: any = { userId };

  if (status) where.status = status;

  // Customer filter: interpret as exact match on customerId (preferred). If your schema uses customer name,
  // replace with { customer: { name: customer } } and ensure an index exists accordingly.
  if (customer) where.customerId = customer;

  if (invoiceNumber) where.invoiceNumber = invoiceNumber;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      if (!isNaN(start.getTime())) (where.createdAt as any).gte = start;
    }
    if (endDate) {
      const end = new Date(`${endDate}T23:59:59.999Z`);
      if (!isNaN(end.getTime())) (where.createdAt as any).lte = end;
    }
  }

  const skip = (page - 1) * limit;
  const take = limit;

  const [invoices, totalCount] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invoice.count({ where }),
  ]);

  return { invoices, totalCount };
}

export const invoiceRepository = {
  findAllByUser,
  findById,
  create,
  update,
  remove,
  findManyWithPaginationAndFilters,
};

export default invoiceRepository;
