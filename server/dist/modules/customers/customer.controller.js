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
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomer = exports.listCustomers = void 0;
const customer_service_1 = __importDefault(require("./customer.service"));
function listCustomers(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const customers = yield customer_service_1.default.listByUser(userId);
            return res.json(customers);
        }
        catch (err) {
            return next(err);
        }
    });
}
exports.listCustomers = listCustomers;
function getCustomer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const customer = yield customer_service_1.default.getById(id);
            if (!customer)
                return res.status(404).json({ message: 'Not Found: Resource not found.' });
            return res.json(customer);
        }
        catch (err) {
            return next(err);
        }
    });
}
exports.getCustomer = getCustomer;
function createCustomer(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const { name, email, phone, address } = req.body || {};
            if (!name || typeof name !== 'string') {
                return res.status(400).json({ message: 'Bad Request: name is required.' });
            }
            const created = yield customer_service_1.default.create(userId, { name, email, phone, address });
            return res.status(201).json(created);
        }
        catch (err) {
            return next(err);
        }
    });
}
exports.createCustomer = createCustomer;
function updateCustomer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, email, phone, address } = req.body || {};
            const updated = yield customer_service_1.default.update(id, { name, email, phone, address });
            if (!updated)
                return res.status(404).json({ message: 'Not Found: Resource not found.' });
            return res.json(updated);
        }
        catch (err) {
            return next(err);
        }
    });
}
exports.updateCustomer = updateCustomer;
function deleteCustomer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const ok = yield customer_service_1.default.remove(id);
            if (!ok)
                return res.status(404).json({ message: 'Not Found: Resource not found.' });
            return res.status(204).send();
        }
        catch (err) {
            return next(err);
        }
    });
}
exports.deleteCustomer = deleteCustomer;
