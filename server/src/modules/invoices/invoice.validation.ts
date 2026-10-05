import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required.').max(255, 'Description cannot exceed 255 characters.'),
  quantity: z.number().int().positive('Quantity must be a positive integer.').min(1, 'Quantity must be at least 1.'),
  unitPrice: z.number().positive('Unit price must be a positive number.').min(0.01, 'Unit price must be at least 0.01.').refine(val => /^-?\d*(\.\d{1,2})?$/.test(val.toFixed(2)), 'Unit price must have at most 2 decimal places.'),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID format.').min(1, 'Customer ID is required.'),
  issueDate: z.string().datetime('Invalid issue date format.').transform((str) => new Date(str)),
  dueDate: z.string().datetime('Invalid due date format.').transform((str) => new Date(str)),
  items: z.array(invoiceItemSchema).min(1, 'At least one invoice item is required.'),
  discount: z.number().min(0, 'Discount cannot be negative.').optional().default(0),
  tax: z.number().min(0, 'Tax cannot be negative.').optional().default(0),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters.').optional().nullable(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'VOID']).optional().default('DRAFT'),
});

export const updateInvoiceSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID format.').min(1, 'Customer ID is required.').optional(),
  issueDate: z.string().datetime('Invalid issue date format.').transform((str) => new Date(str)).optional(),
  dueDate: z.string().datetime('Invalid due date format.').transform((str) => new Date(str)).optional(),
  items: z.array(invoiceItemSchema.extend({ id: z.string().uuid('Invalid item ID format.').optional() })).min(1, 'At least one invoice item is required.').optional(),
  discount: z.number().min(0, 'Discount cannot be negative.').optional(),
  tax: z.number().min(0, 'Tax cannot be negative.').optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters.').optional().nullable(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'VOID']).optional(),
});
