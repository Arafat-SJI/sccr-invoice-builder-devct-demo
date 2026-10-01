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
exports.invoiceRepository = void 0;
const crypto_1 = require("crypto");
const invoices = [];
function findAllByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return invoices.filter((i) => i.userId === userId);
    });
}
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return invoices.find((i) => i.id === id) || null;
    });
}
function create(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const items = Array.isArray(data.items) ? data.items : [];
        const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
        const invoice = {
            id: (0, crypto_1.randomUUID)(),
            userId: data.userId,
            customerId: data.customerId,
            items,
            subtotal,
            total: subtotal,
            status: (_a = data.status) !== null && _a !== void 0 ? _a : 'DRAFT',
            createdAt: now,
            updatedAt: now,
        };
        invoices.push(invoice);
        return invoice;
    });
}
function update(id, data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const index = invoices.findIndex((i) => i.id === id);
        if (index === -1)
            return null;
        const current = invoices[index];
        let items = (_a = data.items) !== null && _a !== void 0 ? _a : current.items;
        if (!Array.isArray(items))
            items = current.items;
        const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
        const updated = Object.assign(Object.assign(Object.assign({}, current), data), { items,
            subtotal, total: subtotal, userId: current.userId, updatedAt: new Date() });
        invoices[index] = updated;
        return updated;
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = invoices.findIndex((i) => i.id === id);
        if (index === -1)
            return false;
        invoices.splice(index, 1);
        return true;
    });
}
exports.invoiceRepository = {
    findAllByUser,
    findById,
    create,
    update,
    remove,
};
exports.default = exports.invoiceRepository;
