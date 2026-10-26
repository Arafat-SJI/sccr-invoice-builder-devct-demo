import { z } from 'zod';

// Allowed invoice statuses based on repository type
export const allowedStatuses = ['DRAFT', 'SENT', 'PAID', 'VOID'] as const;

export const invoiceQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(allowedStatuses).optional(),
    // Interpret `customer` as exact match on customerId. If you prefer customer name, update repository accordingly.
    customer: z.string().trim().min(1).optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/u, 'startDate must be in YYYY-MM-DD format')
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/u, 'endDate must be in YYYY-MM-DD format')
      .optional(),
    invoiceNumber: z.string().trim().min(1).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: 'startDate must be before or equal to endDate', path: ['endDate'] },
  );

export type InvoiceQuerySchema = z.infer<typeof invoiceQuerySchema>;
