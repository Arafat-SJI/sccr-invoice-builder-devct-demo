import type { Invoice as PrismaInvoice } from '@prisma/client';

export type InvoiceQueryParams = {
  page: number;
  limit: number;
  status?: 'DRAFT' | 'SENT' | 'PAID' | 'VOID';
  // Interpret as exact customerId; change to customerName as needed and update repository where clause accordingly.
  customer?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  invoiceNumber?: string;
};

export type PaginatedInvoicesResponse = {
  invoices: PrismaInvoice[];
  metadata: {
    totalCount: number;
    page: number;
    limit: number;
  };
};
