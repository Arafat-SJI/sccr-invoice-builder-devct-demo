import { PrismaClient, Invoice as PrismaInvoice } from '@prisma/client';

const prisma = new PrismaClient();

export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'VOID';

export type Invoice = PrismaInvoice;

export type CreateInvoiceDTO = {
  userId: string;
  customerId?: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string;
  status: InvoiceStatus;
};

export type UpdateInvoiceDTO = Partial<Omit<Invoice, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

async function findAllByUser(userId: string): Promise<Invoice[]> {
  return prisma.invoice.findMany({ where: { userId } });
}

async function findById(id: string): Promise<Invoice | null> {
  return prisma.invoice.findUnique({ where: { id } });
}

async function create(data: CreateInvoiceDTO): Promise<Invoice> {
  return prisma.$transaction(async (trx) => {
    const invoice = await trx.invoice.create({
      data: {
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
        status: data.status,
      },
    });

    await Promise.all(
      data.items.map((item) =>
        trx.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
          },
        })
      )
    );

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
  const result = await prisma.invoice.delete({ where: { id } });
  return !!result;
}

export const invoiceRepository = {
  findAllByUser,
  findById,
  create,
  update,
  remove,
};

export default invoiceRepository;
