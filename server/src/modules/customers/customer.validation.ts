import { z } from 'zod';

// Basic, pragmatic phone regex allowing digits and common symbols; optional leading +
const phoneRegex = /^[+]?[-()\s\d]{7,20}$/;

export const createCustomerSchema = z.object({
  name: z.string({ required_error: 'name is required' }).trim().min(1, 'name is required'),
  email: z
    .string()
    .trim()
    .email('email must be a valid email address')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'phone must be a valid phone number')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  address: z
    .string()
    .trim()
    .max(1000, 'address is too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  taxId: z
    .string()
    .trim()
    .max(100, 'taxId is too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export const updateCustomerSchema = createCustomerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
