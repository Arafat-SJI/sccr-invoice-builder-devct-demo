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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function findAllByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const rows = yield prisma.customer.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return rows;
    });
}
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const row = yield prisma.customer.findUnique({ where: { id } });
        return row || null;
    });
}
function create(data) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const row = yield prisma.customer.create({
            data: {
                userId: data.userId,
                name: data.name,
                email: (_a = data.email) !== null && _a !== void 0 ? _a : null,
                phone: (_b = data.phone) !== null && _b !== void 0 ? _b : null,
                address: (_c = data.address) !== null && _c !== void 0 ? _c : null,
                taxId: (_d = data.taxId) !== null && _d !== void 0 ? _d : null,
            },
        });
        return row;
    });
}
function update(id, data) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const row = yield prisma.customer.update({
                where: { id },
                data: {
                    name: data.name,
                    email: (_a = data.email) !== null && _a !== void 0 ? _a : undefined,
                    phone: (_b = data.phone) !== null && _b !== void 0 ? _b : undefined,
                    address: (_c = data.address) !== null && _c !== void 0 ? _c : undefined,
                    taxId: (_d = data.taxId) !== null && _d !== void 0 ? _d : undefined,
                },
            });
            return row;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                // Record not found
                return null;
            }
            throw e;
        }
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.customer.delete({ where: { id } });
            return true;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025')
                    return false; // not found
                // P2003: foreign key violation (e.g., restricted by invoices)
                if (e.code === 'P2003')
                    throw e;
            }
            throw e;
        }
    });
}
function hasInvoices(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield prisma.invoice.count({ where: { customerId } });
        return count > 0;
    });
}
exports.customerRepository = {
    findAllByUser,
    findById,
    create,
    update,
    remove,
    hasInvoices,
};
exports.default = exports.customerRepository;
