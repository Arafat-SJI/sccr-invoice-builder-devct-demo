import { useMutation } from 'react-query';
import apiClient from './client';
import { CreateInvoicePayload } from './invoice.types';

export function useCreateInvoice(options: any) {
  return useMutation((data: CreateInvoicePayload) => apiClient.post('/invoices', data), options);
}
