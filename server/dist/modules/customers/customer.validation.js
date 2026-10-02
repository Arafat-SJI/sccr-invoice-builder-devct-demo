"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
// Basic, pragmatic phone regex allowing digits and common symbols; optional leading +
const phoneRegex = /^[+]?[-()\s\d]{7,20}$/;
exports.createCustomerSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: 'name is required' }).trim().min(1, 'name is required'),
    email: zod_1.z
        .string()
        .trim()
        .email('email must be a valid email address')
        .optional()
        .or(zod_1.z.literal('').transform(() => undefined)),
    phone: zod_1.z
        .string()
        .trim()
        .regex(phoneRegex, 'phone must be a valid phone number')
        .optional()
        .or(zod_1.z.literal('').transform(() => undefined)),
    address: zod_1.z
        .string()
        .trim()
        .max(1000, 'address is too long')
        .optional()
        .or(zod_1.z.literal('').transform(() => undefined)),
    taxId: zod_1.z
        .string()
        .trim()
        .max(100, 'taxId is too long')
        .optional()
        .or(zod_1.z.literal('').transform(() => undefined)),
});
exports.updateCustomerSchema = exports.createCustomerSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
});
