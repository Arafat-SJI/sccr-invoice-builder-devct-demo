import { randomUUID } from 'crypto';

export type Customer = {
  id: string;
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null; // legacy consolidated address field (kept for compatibility)
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCustomerDTO = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateCustomerDTO = Partial<Omit<Customer, 'id' | 'userId' | 'createdAt' | 'deletedAt'>>;

const customers: Customer[] = [];

async function findAllByUser(userId: string): Promise<Customer[]> {
  // Return all customers belonging to a user (including soft-deleted ones);
  // filtering for active customers is handled at the service layer.
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
    email: data.email ?? null,
    phone: data.phone ?? null,
    address: data.address ?? null,
    addressLine1: data.addressLine1 ?? null,
    addressLine2: data.addressLine2 ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    zipCode: data.zipCode ?? null,
    country: data.country ?? null,
    deletedAt: null,
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

/**
 * Soft-delete the customer record by setting deletedAt. This preserves invoice history.
 * The repository keeps a hardRemove() function for permanent deletes; currently
 * the service layer decides which to call. For simplicity we expose remove() as a soft-delete.
 */
async function remove(id: string): Promise<boolean> {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return false;
  const current = customers[index];
  customers[index] = { ...current, deletedAt: new Date(), updatedAt: new Date() };
  return true;
}

/**
 * Hard remove — permanently deletes the customer from storage. Not normally used
 * when customer is referenced by invoices. Provided for administrative operations.
 */
async function hardRemove(id: string): Promise<boolean> {
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
  hardRemove,
};

export default customerRepository;
