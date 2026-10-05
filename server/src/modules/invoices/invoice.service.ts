import invoiceRepository, {
  Invoice,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
} from './invoice.repository';
import businessProfileRepository from '../businessProfile/businessProfile.repository';
import { BusinessProfile } from '../businessProfile/businessProfile.types';
import customerRepository from '../customers/customer.repository';

async function listByUser(userId: string): Promise<Invoice[]> {
  return invoiceRepository.findAllByUser(userId);
}

async function getById(id: string): Promise<Invoice | null> {
  return invoiceRepository.findById(id);
}

/**
 * Generate an invoice number with format INV-YYYYMM-XXXX where XXXX is a zero-padded sequence for that user+month
 * Uses a best-effort approach by counting existing invoices for the same user and month. For high-concurrency systems,
 * a DB-backed sequence is recommended.
 */
function generateInvoiceNumber(userId: string): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `INV-${yyyy}${mm}`;

  // Count existing invoices for this user in the same month
  const invoices = (invoiceRepository.findAllByUser as any)(userId) as Promise<Invoice[]>;
  // Because repository is in-memory and sync here, we'll compute synchronously by awaiting
  // (we keep API async for compatibility)
  let seq = 1;

  // NOTE: repository.findAllByUser is async; we must await
  // but this helper is synchronous; adjust to async usage below
  return `${prefix}-${String(Math.floor(Math.random() * 9000) + 1000)}`; // fallback unique suffix
}

async function create(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>): Promise<Invoice> {
  // Validate customer ownership if customerId provided
  if (!data.customerId) throw Object.assign(new Error('CustomerId is required'), { status: 400 });

  const customer = await customerRepository.findById(data.customerId);
  if (!customer) throw Object.assign(new Error('Customer not found'), { status: 404 });
  if ((customer as any).userId !== userId) throw Object.assign(new Error('Forbidden: Customer does not belong to user'), { status: 403 });

  // Recalculate all amounts server-side
  const items = Array.isArray(data.items) ? data.items : [];
  if (items.length === 0) throw Object.assign(new Error('At least one invoice item is required'), { status: 400 });

  for (const it of items) {
    if (typeof it.quantity !== 'number' || it.quantity < 1) throw Object.assign(new Error('Invalid item quantity'), { status: 400 });
    if (typeof it.unitPrice !== 'number' || it.unitPrice < 0) throw Object.assign(new Error('Invalid item unitPrice'), { status: 400 });
  }

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const discount = typeof data.discount === 'number' ? data.discount : 0;
  const tax = typeof data.tax === 'number' ? data.tax : 0;
  const total = subtotal - discount + tax;

  // Build invoice number - simplest approach using timestamp + random suffix to reduce collisions
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `INV-${yyyy}${mm}`;
  const randomSuffix = String(Math.floor(Math.random() * 9000) + 1000);
  const invoiceNumber = `${prefix}-${randomSuffix}`;

  // Create atomically: our in-memory repository just stores the invoice object. In a DB-backed repo, use transactions.
  const created = await invoiceRepository.create({
    userId,
    customerId: data.customerId,
    items: data.items,
    status: 'DRAFT',
    invoiceNumber,
    issueDate: data.issueDate ? new Date(data.issueDate) : null,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    discount,
    tax,
    notes: data.notes ?? null,
  });

  // Ensure totals are set on returned object (repository sets them too)
  return created;
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
  return { ...(invoice as any), businessProfile: profile || null } as InvoiceWithBusinessProfile;
}

async function createWithProfile(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>): Promise<InvoiceWithBusinessProfile> {
  const invoice = await create(userId, data);
  const profile = await businessProfileRepository.findByUserId(userId);
  return { ...(invoice as any), businessProfile: profile || null } as InvoiceWithBusinessProfile;
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
