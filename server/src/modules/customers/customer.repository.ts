import { PrismaClient, Prisma } from '@prisma/client';

export type Customer = {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCustomerDTO = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerDTO = Partial<Omit<Customer, 'id' | 'userId' | 'createdAt'>>;

const prisma = new PrismaClient();

async function findAllByUser(userId: string): Promise<Customer[]> {
  const rows = await prisma.customer.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return rows as unknown as Customer[];
}

async function findById(id: string): Promise<Customer | null> {
  const row = await prisma.customer.findUnique({ where: { id } });
  return (row as unknown as Customer) || null;
}

async function create(data: CreateCustomerDTO): Promise<Customer> {
  const row = await prisma.customer.create({
    data: {
      userId: data.userId,
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      taxId: data.taxId ?? null,
    },
  });
  return row as unknown as Customer;
}

async function update(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
  try {
    const row = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        address: data.address ?? undefined,
        taxId: data.taxId ?? undefined,
      },
    });
    return row as unknown as Customer;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      // Record not found
      return null;
    }
    throw e;
  }
}

async function remove(id: string): Promise<boolean> {
  try {
    await prisma.customer.delete({ where: { id } });
    return true;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') return false; // not found
      // P2003: foreign key violation (e.g., restricted by invoices)
      if (e.code === 'P2003') throw e;
    }
    throw e;
  }
}

async function hasInvoices(customerId: string): Promise<boolean> {
  const count = await prisma.invoice.count({ where: { customerId } });
  return count > 0;
}

export const customerRepository = {
  findAllByUser,
  findById,
  create,
  update,
  remove,
  hasInvoices,
};

export default customerRepository;
