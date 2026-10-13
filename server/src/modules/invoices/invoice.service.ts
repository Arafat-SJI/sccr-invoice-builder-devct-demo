import invoiceRepository, {
  Invoice,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
} from './invoice.repository';

async function listByUser(userId: string): Promise<Invoice[]> {
  return invoiceRepository.findAllByUser(userId);
}

async function getById(id: string): Promise<Invoice | null> {
  return invoiceRepository.findById(id);
}

async function create(userId: string, data: Omit<CreateInvoiceDTO, 'userId'>): Promise<Invoice> {
  const { customerId, items, discount, tax, notes, status } = data;
  const invoiceNumber = generateInvoiceNumber();
  const subtotal = calculateSubtotal(items);
  const total = calculateTotal(subtotal, discount, tax);

  return invoiceRepository.create({
    userId,
    customerId,
    invoiceNumber,
    invoiceDate: new Date(),
    dueDate: new Date(),
    items,
    subtotal,
    discount,
    tax,
    total,
    notes,
    status,
  });
}

async function update(id: string, data: UpdateInvoiceDTO & { items?: unknown }): Promise<Invoice | null> {
  // Items are managed in InvoiceItem; ignore here to avoid invalid Prisma update args
  const { items, ...invoiceData } = (data || {}) as UpdateInvoiceDTO & { items?: unknown };
  return invoiceRepository.update(id, invoiceData);
}

async function remove(id: string): Promise<boolean> {
  return invoiceRepository.remove(id);
}

function generateInvoiceNumber(): string {
  return `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function calculateSubtotal(items: { quantity: number; unitPrice: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function calculateTotal(subtotal: number, discount: number, tax: number): number {
  return subtotal - discount + tax;
}

const invoiceService = {
  listByUser,
  getById,
  create,
  update,
  remove,
};

export default invoiceService;
