import customerRepository, {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from './customer.repository';

async function listByUser(userId: string): Promise<Customer[]> {
  // Only return non-deleted customers to callers by default
  const all = await customerRepository.findAllByUser(userId);
  return all.filter((c) => !c.deletedAt);
}

async function getById(id: string): Promise<Customer | null> {
  return customerRepository.findById(id);
}

async function create(userId: string, data: Omit<CreateCustomerDTO, 'userId'>): Promise<Customer> {
  return customerRepository.create({ ...data, userId });
}

async function update(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
  // Never allow userId change at service layer
  if ((data as any).userId) {
    delete (data as any).userId;
  }
  return customerRepository.update(id, data);
}

/**
 * Remove a customer. Business rule:
 * - If invoices reference the customer, mark deletedAt (soft delete) so invoices keep historical integrity.
 * - If no invoices reference the customer, a hard delete is permissible.
 *
 * Our in-memory repository cannot check invoices; repository.remove() performs a soft-delete.
 * In a real Prisma-backed implementation, this function would inspect invoice references
 * and decide whether to call a hard delete or soft delete. For now, always perform soft-delete
 * to preserve history.
 */
async function remove(id: string): Promise<boolean> {
  return customerRepository.remove(id);
}

const customerService = {
  listByUser,
  getById,
  create,
  update,
  remove,
};

export default customerService;
