import customerRepository from './customer.repository';
import { Customer } from './customer.types';
import { createCustomerSchema, updateCustomerSchema, CreateCustomerInput, UpdateCustomerInput } from './customer.validation';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../utils/errors';

async function listByUser(userId: string): Promise<Customer[]> {
  return customerRepository.findAllByUser(userId);
}

async function getById(id: string, userId: string): Promise<Customer | null> {
  const customer = await customerRepository.findById(id);
  if (!customer) return null;
  if (customer.userId !== userId) throw new UnauthorizedError('Access denied: Customer does not belong to the authenticated user.');
  return customer;
}

function toCreateDto(data: CreateCustomerInput) {
  return {
    name: data.name,
    email: data.email ?? null,
    phone: data.phone ?? null,
    addressLine1: data.addressLine1 ?? null,
    addressLine2: data.addressLine2 ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    postalCode: data.postalCode ?? null,
    country: data.country ?? null,
  };
}

async function create(userId: string, data: CreateCustomerInput): Promise<Customer> {
  const validatedData = createCustomerSchema.parse(data);
  return customerRepository.create({ ...toCreateDto(validatedData), userId });
}

async function update(id: string, userId: string, data: UpdateCustomerInput): Promise<Customer | null> {
  const existingCustomer = await customerRepository.findById(id);
  if (!existingCustomer) throw new NotFoundError('Customer not found.');
  if (existingCustomer.userId !== userId) throw new UnauthorizedError('Access denied: Customer does not belong to the authenticated user.');

  const validatedData = updateCustomerSchema.parse(data);
  return customerRepository.update(id, validatedData);
}

async function remove(id: string, userId: string): Promise<boolean> {
  const existingCustomer = await customerRepository.findById(id);
  if (!existingCustomer) throw new NotFoundError('Customer not found.');
  if (existingCustomer.userId !== userId) throw new UnauthorizedError('Access denied: Customer does not belong to the authenticated user.');

  const invoiceCount = await customerRepository.countInvoicesByCustomer(id);
  if (invoiceCount > 0) {
    throw new ConflictError('Cannot delete customer: Customer is referenced by existing invoices.');
  }

  const deletedCustomer = await customerRepository.remove(id);
  return !!deletedCustomer;
}

const customerService = {
  listByUser,
  getById,
  create,
  update,
  remove,
};

export default customerService;
