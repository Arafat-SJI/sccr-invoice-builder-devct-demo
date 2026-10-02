import customerRepository, {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from './customer.repository';

class ConflictError extends Error {
  status = 409 as const;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

async function listByUser(userId: string): Promise<Customer[]> {
  return customerRepository.findAllByUser(userId);
}

async function getById(id: string): Promise<Customer | null> {
  return customerRepository.findById(id);
}

async function create(userId: string, data: Omit<CreateCustomerDTO, 'userId'>): Promise<Customer> {
  return customerRepository.create({ ...data, userId });
}

async function update(id: string, data: UpdateCustomerDTO): Promise<Customer | null> {
  return customerRepository.update(id, data);
}

async function remove(id: string): Promise<boolean> {
  // Prevent deletion if invoices exist for this customer
  const hasRefs = await customerRepository.hasInvoices(id);
  if (hasRefs) {
    throw new ConflictError('Customer cannot be deleted because it is referenced by existing invoices');
  }
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
export { ConflictError };
