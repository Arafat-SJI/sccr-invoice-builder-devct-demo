import { randomUUID } from 'crypto';
import { PrismaClient, Prisma } from '@prisma/client';

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
  // extended fields accepted by repository
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  discount?: number;
  tax?: number;
  notes?: string;
  subtotal?: number;
  total?: number;
};

export type UpdateInvoiceDTO = Partial<Omit<Invoice, 'id' | 'userId' | 'createdAt'>>;

// Legacy in-memory store kept for test/dev fallback (preserved from earlier implementation)
const inMemoryInvoices: Invoice[] = [];

const prisma = new PrismaClient();

async function findAllByUser(userId: string) {
  // returns invoices including items
  const rows = await prisma.invoice.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return rows;
}

async function findById(id: string) {
  const row = await prisma.invoice.findUnique({ where: { id }, include: { items: true } });
  return row || null;
}

async function create(data: CreateInvoiceDTO) {
  // Creates invoice and nested items in a transaction
  // Accepts pre-calculated subtotal/discount/tax/total and invoiceNumber
  const id = randomUUID();

  const items = Array.isArray(data.items) ? data.items : [];

  const now = new Date();

  // Use prisma transaction to atomically create invoice and items
  const created = await prisma.$transaction(async (tx) => {
    const inv = await tx.invoice.create({
      data: {
        id,
        userId: data.userId,
        customerId: data.customerId ?? undefined,
        invoiceNumber: data.invoiceNumber ?? '',
        issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        subtotal: data.subtotal ?? 0,
        discount: data.discount ?? 0,
        tax: data.tax ?? 0,
        total: data.total ?? 0,
        notes: data.notes ?? undefined,
        status: data.status ?? 'DRAFT',
      },
    });

    if (items.length > 0) {
      const createItems = items.map((it) => ({
        id: randomUUID(),
        invoiceId: inv.id,
        description: it.description,
        quantity: new Prisma.Decimal(it.quantity as any),
        unitPrice: new Prisma.Decimal(it.unitPrice as any),
        amount: new Prisma.Decimal((it.quantity * it.unitPrice) as any),
      }));

      await tx.invoiceItem.createMany({ data: createItems });
    }

    const withItems = await tx.invoice.findUnique({ where: { id: inv.id }, include: { items: true } });
    return withItems;
  });

  return created;
}

async function update(id: string, data: UpdateInvoiceDTO) {
  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) return null;

  // Prepare updates for invoice
  const updateData: any = { updatedAt: new Date() };
  if ((data as any).customerId !== undefined) updateData.customerId = (data as any).customerId;
  if ((data as any).status !== undefined) updateData.status = (data as any).status;
  if ((data as any).notes !== undefined) updateData.notes = (data as any).notes;
  if ((data as any).subtotal !== undefined) updateData.subtotal = (data as any).subtotal;
  if ((data as any).discount !== undefined) updateData.discount = (data as any).discount;
  if ((data as any).tax !== undefined) updateData.tax = (data as any).tax;
  if ((data as any).total !== undefined) updateData.total = (data as any).total;

  // Replace items if provided
  return await prisma.$transaction(async (tx) => {
    if (Array.isArray((data as any).items)) {
      // delete existing items
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });

      // create new items
      const items = (data as any).items as InvoiceItem[];
      for (const it of items) {
        await tx.invoiceItem.create({
          data: {
            id: randomUUID(),
            invoiceId: id,
            description: it.description,
            quantity: new Prisma.Decimal(it.quantity as any),
            unitPrice: new Prisma.Decimal(it.unitPrice as any),
            amount: new Prisma.Decimal((it.quantity * it.unitPrice) as any),
          },
        });
      }
    }

    await tx.invoice.update({ where: { id }, data: updateData });
    const updated = await tx.invoice.findUnique({ where: { id }, include: { items: true } });
    return updated;
  });
}

async function remove(id: string) {
  // Delete invoice and cascade will remove items via DB foreign key
  const deleted = await prisma.invoice.deleteMany({ where: { id } });
  return deleted.count > 0;
}

export const invoiceRepository = {
  findAllByUser,
  findById,
  create,
  update,
  remove,
};

export default invoiceRepository;
