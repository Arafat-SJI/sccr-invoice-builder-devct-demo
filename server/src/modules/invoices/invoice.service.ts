import invoiceRepository, {
  Invoice,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
} from './invoice.repository';
import businessProfileRepository from '../businessProfile/businessProfile.repository';
import { BusinessProfile } from '../businessProfile/businessProfile.types';
import { randomUUID } from 'crypto';

async function listByUser(userId: string): Promise<Invoice[]> {
  return invoiceRepository.findAllByUser(userId);
}

async function getById(id: string): Promise<Invoice | null> {
  return invoiceRepository.findById(id);
}

async function create(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>): Promise<Invoice> {
  const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomUUID().slice(0, 4)}`;
  const invoiceData = { ...data, userId, invoiceNumber };
  return invoiceRepository.create(invoiceData);
}

async function update(id: string, userId: string, data: UpdateInvoiceDTO): Promise<Invoice | null> {
  return invoiceRepository.update(id, { ...data, userId });
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
