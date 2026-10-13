import { z } from 'zod';

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid(),
  invoiceDate: z.date(),
  dueDate: z.date(),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })
  ).min(1),
  discount: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  notes: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'VOID']),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();
