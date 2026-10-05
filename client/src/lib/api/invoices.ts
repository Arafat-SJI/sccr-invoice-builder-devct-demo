import { apiClient, extractApiError } from '@/lib/api/client';
import { CreateInvoiceDTO, Invoice } from './invoice.types';

export async function createInvoice(data: CreateInvoiceDTO): Promise<Invoice> {
  try {
    const response = await apiClient.post<Invoice>('/invoices', data);
    return response.data;
  } catch (error) {
    throw extractApiError(error);
  }
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  try {
    const response = await apiClient.get<Invoice>(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw extractApiError(error);
  }
}

export async function listInvoices(): Promise<Invoice[]> {
  try {
    const response = await apiClient.get<Invoice[]>('/invoices');
    return response.data;
  } catch (error) {
    throw extractApiError(error);
  }
}
