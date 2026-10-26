import invoiceRepository, {
  Invoice,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
} from './invoice.repository';
import businessProfileRepository from '../businessProfile/businessProfile.repository';
import { BusinessProfile } from '../businessProfile/businessProfile.types';
import { InvoiceQueryParams, PaginatedInvoicesResponse } from './invoice.types';

async function listByUser(userId: string): Promise<Invoice[]> {
  return invoiceRepository.findAllByUser(userId);
}

async function getById(id: string): Promise<Invoice | null> {
  return invoiceRepository.findById(id);
}

async function create(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>): Promise<Invoice> {
  return invoiceRepository.create({ ...data, userId });
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
  const userId: string = invoice.userId;
  const profile = userId ? await businessProfileRepository.findByUserId(userId) : null;
  return { ...invoice, businessProfile: profile || null };
}

async function createWithProfile(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>): Promise<InvoiceWithBusinessProfile> {
  const invoice = await invoiceRepository.create({ ...data, userId });
  const profile = await businessProfileRepository.findByUserId(userId);
  return { ...invoice, businessProfile: profile || null };
}

// New service method: paginated and filtered invoices scoped by user (uses Prisma via repository)
async function getPaginatedInvoices(userId: string, query: InvoiceQueryParams): Promise<PaginatedInvoicesResponse> {
  const { invoices, totalCount } = await invoiceRepository.findManyWithPaginationAndFilters(userId, query);
  return {
    invoices,
    metadata: {
      totalCount,
      page: query.page,
      limit: query.limit,
    },
  };
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
  // paginated listing
  getPaginatedInvoices,
};

export default invoiceService;
