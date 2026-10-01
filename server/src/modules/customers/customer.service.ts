import customerRepository, {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from './customer.repository';

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
