import { z } from 'zod';

const itemSchema = z.object({
  description: z.string().min(1).max(1000),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  items: z.array(itemSchema).min(1),
  discount: z.number().nonnegative().optional().default(0),
  tax: z.number().nonnegative().optional().default(0),
  notes: z.string().max(2000).optional(),
});

export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;
