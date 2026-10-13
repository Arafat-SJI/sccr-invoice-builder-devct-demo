import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

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
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string;
  status?: InvoiceStatus;
};

export type UpdateInvoiceDTO = Partial<Omit<Invoice, 'id' | 'userId' | 'createdAt'>>;

async function findAllByUser(userId: string): Promise<Invoice[]> {
  return prisma.invoice.findMany({ where: { userId } });
}

async function findById(id: string): Promise<Invoice | null> {
  return prisma.invoice.findUnique({ where: { id } });
}

async function create(data: CreateInvoiceDTO): Promise<Invoice> {
  return prisma.$transaction(async (prisma) => {
    const invoice = await prisma.invoice.create({
      data: {
        id: randomUUID(),
        userId: data.userId,
        customerId: data.customerId,
        invoiceNumber: data.invoiceNumber,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        subtotal: data.subtotal,
        discount: data.discount,
        tax: data.tax,
        total: data.total,
        notes: data.notes,
        status: data.status ?? 'DRAFT',
      },
    });

    await prisma.invoiceItem.createMany({
      data: data.items.map((item) => ({
        id: randomUUID(),
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice,
      })),
    });

    return invoice;
  });
}

async function update(id: string, data: UpdateInvoiceDTO): Promise<Invoice | null> {
  return prisma.invoice.update({
    where: { id },
    data,
  });
}

async function remove(id: string): Promise<boolean> {
  const deleted = await prisma.invoice.delete({ where: { id } });
  return !!deleted;
}

export const invoiceRepository = {
  findAllByUser,
  findById,
  create,
  update,
  remove,
};

export default invoiceRepository;
