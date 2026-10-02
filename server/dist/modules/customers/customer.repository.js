"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRepository = void 0;
const prisma_1 = require("../../lib/prisma");
function findAllByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prisma.customer.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
    });
}
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prisma.customer.findUnique({
            where: { id },
        });
    });
}
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prisma.customer.create({
            data: {
                userId: data.userId,
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                addressLine1: data.addressLine1 || null,
                addressLine2: data.addressLine2 || null,
                city: data.city || null,
                state: data.state || null,
                postalCode: data.postalCode || null,
                country: data.country || null,
            },
        });
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prisma.customer.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country,
            },
        });
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prisma.customer.delete({
            where: { id },
        });
    });
}
function countInvoicesByCustomer(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prisma.invoice.count({
            where: { customerId },
        });
    });
}
exports.customerRepository = {
    findAllByUser,
    findById,
    create,
    update,
    remove,
    countInvoicesByCustomer,
};
exports.default = exports.customerRepository;
