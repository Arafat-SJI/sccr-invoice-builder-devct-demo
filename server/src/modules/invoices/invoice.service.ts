import invoiceRepository, {
  Invoice,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
} from './invoice.repository';
import businessProfileRepository from '../businessProfile/businessProfile.repository';
import { BusinessProfile } from '../businessProfile/businessProfile.types';
import { createInvoiceSchema } from './invoice.validation';
import { Decimal } from '@prisma/client/runtime';

async function listByUser(userId: string): Promise<Invoice[]> {
  return invoiceRepository.findAllByUser(userId);
}

async function getById(id: string): Promise<Invoice | null> {
  return invoiceRepository.findById(id);
}

async function create(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>): Promise<Invoice> {
  const { customerId, items, invoiceDate, dueDate, discount, tax, notes } = data;

  // Validate customer ownership
  const customer = await businessProfileRepository.findByUserId(userId);
  if (!customer || customer.userId !== userId) {
    throw new Error('Unauthorized: Customer does not belong to user.');
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum.plus(new Decimal(item.quantity).times(item.unitPrice)), new Decimal(0));
  const total = subtotal.minus(discount).plus(tax);

  // Generate unique invoice number
  const invoiceNumber = `INV-${Date.now()}`;

  return invoiceRepository.create({
    userId,
    customerId,
    items,
    invoiceNumber,
    invoiceDate,
    dueDate,
    subtotal,
    discount,
    tax,
    total,
    notes,
    status: 'DRAFT',
  });
}

async function update(id: string, data: UpdateInvoiceDTO): Promise<Invoice | null> {
  return invoiceRepository.update(id, data);
}

async function remove(id: string): Promise<boolean> {
  return invoiceRepository.remove(id);
}

export type InvoiceWithBusinessProfile = Invoice & { businessProfile: BusinessProfile | null };

async function listWithProfileByUser(userId: string): Promise<InvoiceWithBusinessProfile[]> {
  const [invoices, profile] = await Promise.all([
    invoiceRepository.findAllByUser(userId),
    businessProfileRepository.findByUserId(userId),
  ]);
  return invoices.map((inv) => ({ ...inv, businessProfile: profile || null }));
}

async function getWithProfileById(id: string): Promise<InvoiceWithBusinessProfile | null> {
  const invoice = await invoiceRepository.findById(id);
  if (!invoice) return null;
  const userId: string = (invoice as any).userId;
  const profile = userId ? await businessProfileRepository.findByUserId(userId) : null;
  return { ...(invoice as Invoice), businessProfile: profile || null };
}

async function createWithProfile(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>): Promise<InvoiceWithBusinessProfile> {
  const invoice = await invoiceRepository.create({ ...data, userId });
  const profile = await businessProfileRepository.findByUserId(userId);
  return { ...invoice, businessProfile: profile || null };
}

const invoiceService = {
  listByUser,
  getById,
  create,
  update,
  remove,
  listWithProfileByUser,
  getWithProfileById,
  createWithProfile,
};

export default invoiceService;
