import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
  unitPrice: z
    .number({ invalid_type_error: 'Unit price must be a number' })
    .min(0, 'Unit price cannot be negative'),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  items: z
    .array(invoiceItemSchema)
    .min(1, 'At least one invoice item is required'),
  issueDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  discount: z.number().min(0, 'Discount cannot be negative').optional().default(0),
  tax: z.number().min(0, 'Tax cannot be negative').optional().default(0),
  notes: z.string().optional().nullable(),
});

export type CreateInvoiceBody = z.infer<typeof createInvoiceSchema>;
