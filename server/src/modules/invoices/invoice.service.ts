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
  return invoiceRepository.create({ ...data, userId });
}

async function update(id: string, data: UpdateInvoiceDTO): Promise<Invoice | null> {
  return invoiceRepository.update(id, data);
}

async function remove(id: string): Promise<boolean> {
  return invoiceRepository.remove(id);
}

const invoiceService = {
  listByUser,
  getById,
  create,
  update,
  remove,
};

export default invoiceService;
