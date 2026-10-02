import { prisma } from '../../lib/prisma';
import { Customer, CreateCustomerDTO, UpdateCustomerDTO } from './customer.types';

async function findAllByUser(userId: string): Promise<Customer[]> {
  return prisma.customer.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

async function findById(id: string): Promise<Customer | null> {
  return prisma.customer.findUnique({
    where: { id },
  });
}

async function create(data: CreateCustomerDTO & { userId: string }): Promise<Customer> {
  return prisma.customer.create({
    data: {
      userId: data.userId,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      addressLine1: data.addressLine1 || null,
      addressLine2: data.addressLine2 || null,
      city: data.city || null,
      state: data.state || null,
      postalCode: data.postalCode || null,
      country: data.country || null,
    },
  });
}

async function update(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
  return prisma.customer.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
    },
  });
}

async function remove(id: string): Promise<Customer | null> {
  return prisma.customer.delete({
    where: { id },
  });
}

async function countInvoicesByCustomer(customerId: string): Promise<number> {
  return prisma.invoice.count({
    where: { customerId },
  });
}

export const customerRepository = {
  findAllByUser,
  findById,
  create,
  update,
  remove,
  countInvoicesByCustomer,
};

export default customerRepository;
