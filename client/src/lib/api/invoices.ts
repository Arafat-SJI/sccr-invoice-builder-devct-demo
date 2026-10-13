import { apiClient, extractApiError } from './client';
import { CreateInvoicePayload } from './invoice.types';

export async function createInvoice(data: CreateInvoicePayload): Promise<any> {
  try {
    const response = await apiClient.post('/invoices', data);
    return response.data;
  } catch (error) {
    throw extractApiError(error);
  }
}
