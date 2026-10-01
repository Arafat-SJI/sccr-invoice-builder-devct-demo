import { randomUUID } from 'crypto';

export type Customer = {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCustomerDTO = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerDTO = Partial<Omit<Customer, 'id' | 'userId' | 'createdAt'>>;

const customers: Customer[] = [];

async function findAllByUser(userId: string): Promise<Customer[]> {
  return customers.filter((c) => c.userId === userId);
}

async function findById(id: string): Promise<Customer | null> {
  return customers.find((c) => c.id === id) || null;
}

async function create(data: CreateCustomerDTO): Promise<Customer> {
  const now = new Date();
  const customer: Customer = {
    id: randomUUID(),
    userId: data.userId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    createdAt: now,
    updatedAt: now,
  };
  customers.push(customer);
  return customer;
}

async function update(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const current = customers[index];
  const updated: Customer = {
    ...current,
    ...data,
    userId: current.userId, // never allow changing ownership here
    updatedAt: new Date(),
  };
  customers[index] = updated;
  return updated;
}

async function remove(id: string): Promise<boolean> {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return false;
  customers.splice(index, 1);
  return true;
}

export const customerRepository = {
  findAllByUser,
  findById,
  create,
  update,
  remove,
};

export default customerRepository;
