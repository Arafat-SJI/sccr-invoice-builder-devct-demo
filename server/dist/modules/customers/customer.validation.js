"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
exports.createCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address').nullable().optional(),
    phone: zod_1.z.string().nullable().optional(),
    addressLine1: zod_1.z.string().nullable().optional(),
    addressLine2: zod_1.z.string().nullable().optional(),
    city: zod_1.z.string().nullable().optional(),
    state: zod_1.z.string().nullable().optional(),
    postalCode: zod_1.z.string().nullable().optional(),
    country: zod_1.z.string().nullable().optional(),
});
exports.updateCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').optional(),
    email: zod_1.z.string().email('Invalid email address').nullable().optional(),
    phone: zod_1.z.string().nullable().optional(),
    addressLine1: zod_1.z.string().nullable().optional(),
    addressLine2: zod_1.z.string().nullable().optional(),
    city: zod_1.z.string().nullable().optional(),
    state: zod_1.z.string().nullable().optional(),
    postalCode: zod_1.z.string().nullable().optional(),
    country: zod_1.z.string().nullable().optional(),
});
