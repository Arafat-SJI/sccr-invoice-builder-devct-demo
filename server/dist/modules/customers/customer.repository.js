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
const crypto_1 = require("crypto");
const customers = [];
function findAllByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return customers.filter((c) => c.userId === userId);
    });
}
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return customers.find((c) => c.id === id) || null;
    });
}
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const customer = {
            id: (0, crypto_1.randomUUID)(),
            userId: data.userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            createdAt: now,
            updatedAt: now,
        };
        customers.push(customer);
        return customer;
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = customers.findIndex((c) => c.id === id);
        if (index === -1)
            return null;
        const current = customers[index];
        const updated = Object.assign(Object.assign(Object.assign({}, current), data), { userId: current.userId, updatedAt: new Date() });
        customers[index] = updated;
        return updated;
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = customers.findIndex((c) => c.id === id);
        if (index === -1)
            return false;
        customers.splice(index, 1);
        return true;
    });
}
exports.customerRepository = {
    findAllByUser,
    findById,
    create,
    update,
    remove,
};
exports.default = exports.customerRepository;
