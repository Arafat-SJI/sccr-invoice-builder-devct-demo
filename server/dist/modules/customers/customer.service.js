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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_repository_1 = __importDefault(require("./customer.repository"));
const customer_validation_1 = require("./customer.validation");
const errors_1 = require("../../utils/errors");
function listByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return customer_repository_1.default.findAllByUser(userId);
    });
}
function getById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield customer_repository_1.default.findById(id);
        if (!customer)
            return null;
        if (customer.userId !== userId)
            throw new errors_1.UnauthorizedError('Access denied: Customer does not belong to the authenticated user.');
        return customer;
    });
}
function toCreateDto(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        name: data.name,
        email: (_a = data.email) !== null && _a !== void 0 ? _a : null,
        phone: (_b = data.phone) !== null && _b !== void 0 ? _b : null,
        addressLine1: (_c = data.addressLine1) !== null && _c !== void 0 ? _c : null,
        addressLine2: (_d = data.addressLine2) !== null && _d !== void 0 ? _d : null,
        city: (_e = data.city) !== null && _e !== void 0 ? _e : null,
        state: (_f = data.state) !== null && _f !== void 0 ? _f : null,
        postalCode: (_g = data.postalCode) !== null && _g !== void 0 ? _g : null,
        country: (_h = data.country) !== null && _h !== void 0 ? _h : null,
    };
}
function create(userId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedData = customer_validation_1.createCustomerSchema.parse(data);
        return customer_repository_1.default.create(Object.assign(Object.assign({}, toCreateDto(validatedData)), { userId }));
    });
}
function update(id, userId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingCustomer = yield customer_repository_1.default.findById(id);
        if (!existingCustomer)
            throw new errors_1.NotFoundError('Customer not found.');
        if (existingCustomer.userId !== userId)
            throw new errors_1.UnauthorizedError('Access denied: Customer does not belong to the authenticated user.');
        const validatedData = customer_validation_1.updateCustomerSchema.parse(data);
        return customer_repository_1.default.update(id, validatedData);
    });
}
function remove(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingCustomer = yield customer_repository_1.default.findById(id);
        if (!existingCustomer)
            throw new errors_1.NotFoundError('Customer not found.');
        if (existingCustomer.userId !== userId)
            throw new errors_1.UnauthorizedError('Access denied: Customer does not belong to the authenticated user.');
        const invoiceCount = yield customer_repository_1.default.countInvoicesByCustomer(id);
        if (invoiceCount > 0) {
            throw new errors_1.ConflictError('Cannot delete customer: Customer is referenced by existing invoices.');
        }
        const deletedCustomer = yield customer_repository_1.default.remove(id);
        return !!deletedCustomer;
    });
}
const customerService = {
    listByUser,
    getById,
    create,
    update,
    remove,
};
exports.default = customerService;
