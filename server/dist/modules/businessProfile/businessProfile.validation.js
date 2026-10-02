"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertBusinessProfileSchema = void 0;
const zod_1 = require("zod");
// Allow common international formats: +, spaces, hyphens, parentheses
const phoneRegex = /^[+]?[-\s()0-9]{7,20}$/;
exports.upsertBusinessProfileSchema = zod_1.z.object({
    businessName: zod_1.z.string().min(1, 'Business Name is required.').max(255),
    addressLine1: zod_1.z.string().min(1, 'Address Line 1 is required.').max(255),
    addressLine2: zod_1.z.string().max(255).optional().nullable(),
    city: zod_1.z.string().min(1, 'City is required.').max(100),
    stateProvince: zod_1.z.string().min(1, 'State/Province is required.').max(100),
    postalCode: zod_1.z.string().min(1, 'Postal Code is required.').max(20),
    country: zod_1.z.string().min(1, 'Country is required.').max(100),
    taxId: zod_1.z.string().max(50).optional().nullable(),
    contactEmail: zod_1.z.string().email('Invalid email format.').max(255),
    contactPhone: zod_1.z
        .string()
        .regex(phoneRegex, 'Invalid phone number format.')
        .max(50)
        .optional()
        .nullable(),
});
