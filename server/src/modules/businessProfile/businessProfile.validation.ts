import { z } from 'zod';

// Allow common international formats: +, spaces, hyphens, parentheses
const phoneRegex = /^[+]?[-\s()0-9]{7,20}$/;

export const upsertBusinessProfileSchema = z.object({
  businessName: z.string().min(1, 'Business Name is required.').max(255),
  addressLine1: z.string().min(1, 'Address Line 1 is required.').max(255),
  addressLine2: z.string().max(255).optional().nullable(),
  city: z.string().min(1, 'City is required.').max(100),
  stateProvince: z.string().min(1, 'State/Province is required.').max(100),
  postalCode: z.string().min(1, 'Postal Code is required.').max(20),
  country: z.string().min(1, 'Country is required.').max(100),
  taxId: z.string().max(50).optional().nullable(),
  contactEmail: z.string().email('Invalid email format.').max(255),
  contactPhone: z
    .string()
    .regex(phoneRegex, 'Invalid phone number format.')
    .max(50)
    .optional()
    .nullable(),
});

export type UpsertBusinessProfileInput = z.infer<typeof upsertBusinessProfileSchema>;
