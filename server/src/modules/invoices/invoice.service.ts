import invoiceRepository, {
  Invoice,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
} from './invoice.repository';
import businessProfileRepository from '../businessProfile/businessProfile.repository';
import { BusinessProfile } from '../businessProfile/businessProfile.types';
import { generateInvoiceNumber } from './invoiceNumber.service';
import { calculateInvoice } from './invoiceCalculation.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listByUser(userId: string): Promise<any[]> {
  return invoiceRepository.findAllByUser(userId);
}

async function getById(id: string): Promise<any | null> {
  return invoiceRepository.findById(id);
}

/**
 * Create an invoice with validation, ownership checks and full server-side calculations.
 * This method will verify that the customer belongs to the user, generate a unique invoice number,
 * compute subtotal/discount/tax/total and persist invoice + items in a transaction.
 */
async function create(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>) {
  // Validate customer ownership
  if (!data.customerId) throw new Error('Customer is required');

  const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
  if (!customer || customer.userId !== userId) {
    const err: any = new Error('Forbidden: Customer does not belong to the authenticated user');
    err.status = 403;
    throw err;
  }

  // Ensure at least one item
  const items = Array.isArray(data.items) ? data.items : [];
  if (items.length === 0) {
    const err: any = new Error('Validation: At least one invoice item is required');
    err.status = 400;
    throw err;
  }

  // Server-side calculation
  const discount = data.discount ?? 0;
  const tax = data.tax ?? 0;
  const calc = calculateInvoice(items, discount, tax);

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber();

  // Persist using repository which uses prisma transactions
  const created = await invoiceRepository.create({
    userId,
    customerId: data.customerId,
    items,
    status: 'DRAFT',
    invoiceNumber,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    discount: calc.discount,
    tax: calc.tax,
    subtotal: calc.subtotal,
    total: calc.total,
    notes: data.notes,
  });

  // Enrich with business profile
  const profile = await businessProfileRepository.findByUserId(userId);

  // return both invoice and profile for convenience
  return { ...created, businessProfile: profile || null };
}

async function update(id: string, data: UpdateInvoiceDTO): Promise<Invoice | null> {
  return invoiceRepository.update(id, data);
}

async function remove(id: string): Promise<boolean> {
  return invoiceRepository.remove(id);
}

// New helpers that include the creator's BusinessProfile alongside invoices without breaking existing signatures
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
  // @ts-ignore assume repository Invoice includes userId field
  const userId: string = (invoice as any).userId;
  const profile = userId ? await businessProfileRepository.findByUserId(userId) : null;
  return { ...(invoice as Invoice), businessProfile: profile || null };
}

async function createWithProfile(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>): Promise<InvoiceWithBusinessProfile> {
  const invoice = await create(userId, data as any);
  // invoice already returns businessProfile in create, but keep signature
  return invoice as any;
}

const invoiceService = {
  listByUser,
  getById,
  create,
  update,
  remove,
  // enriched helpers (opt-in for controllers that want profile data)
  listWithProfileByUser,
  getWithProfileById,
  createWithProfile,
};

export default invoiceService;
