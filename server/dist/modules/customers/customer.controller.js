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
const errors_1 = require("../../utils/errors");
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
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const userId = req.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const customer = yield customer_service_1.default.getById(id, userId);
            if (!customer)
                return res.status(404).json({ message: 'Not Found: Resource not found.' });
            return res.json(customer);
        }
        catch (err) {
            if (err instanceof errors_1.NotFoundError)
                return res.status(404).json({ message: err.message });
            if (err instanceof errors_1.UnauthorizedError)
                return res.status(403).json({ message: err.message });
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
            const customerData = req.body;
            const created = yield customer_service_1.default.create(userId, customerData);
            return res.status(201).json(created);
        }
        catch (err) {
            return next(err);
        }
    });
}
exports.createCustomer = createCustomer;
function updateCustomer(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const userId = req.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const customerData = req.body;
            const updated = yield customer_service_1.default.update(id, userId, customerData);
            if (!updated)
                return res.status(404).json({ message: 'Not Found: Resource not found.' });
            return res.json(updated);
        }
        catch (err) {
            if (err instanceof errors_1.NotFoundError)
                return res.status(404).json({ message: err.message });
            if (err instanceof errors_1.UnauthorizedError)
                return res.status(403).json({ message: err.message });
            return next(err);
        }
    });
}
exports.updateCustomer = updateCustomer;
function deleteCustomer(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const userId = req.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!userId)
                return res.status(401).json({ message: 'Unauthorized' });
            const ok = yield customer_service_1.default.remove(id, userId);
            if (!ok)
                return res.status(404).json({ message: 'Not Found: Resource not found.' });
            return res.status(204).send();
        }
        catch (err) {
            if (err instanceof errors_1.NotFoundError)
                return res.status(404).json({ message: err.message });
            if (err instanceof errors_1.UnauthorizedError)
                return res.status(403).json({ message: err.message });
            if (err instanceof errors_1.ConflictError)
                return res.status(409).json({ message: err.message });
            return next(err);
        }
    });
}
exports.deleteCustomer = deleteCustomer;
