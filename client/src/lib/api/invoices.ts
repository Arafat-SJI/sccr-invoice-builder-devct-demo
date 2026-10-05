import client from './client';
import { CreateInvoiceDto, Invoice } from './invoice.types';

export async function createInvoice(data: CreateInvoiceDto): Promise<Invoice> {
  try {
    const resp = await client.post('/api/invoices', data);
    return resp.data as Invoice;
  } catch (err: any) {
    // Normalize error for callers
    if (err?.response?.data) {
      throw err.response.data;
    }
    throw err;
  }
}

export default {
  createInvoice,
};
