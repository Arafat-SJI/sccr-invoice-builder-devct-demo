"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomer = exports.listCustomers = void 0;
const client_1 = require("@prisma/client");
const customer_service_1 = __importStar(require("./customer.service"));
const customer_validation_1 = require("./customer.validation");
function zodErrorResponse(err) {
    if (!(err === null || err === void 0 ? void 0 : err.issues))
        return null;
    return {
        message: 'Validation error',
        errors: err.issues.map((i) => { var _a, _b; return ({ path: (_b = (_a = i.path) === null || _a === void 0 ? void 0 : _a.join('.')) !== null && _b !== void 0 ? _b : '', message: i.message }); }),
    };
}
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
            const parsed = customer_validation_1.createCustomerSchema.safeParse(req.body || {});
            if (!parsed.success) {
                const payload = zodErrorResponse(parsed.error);
                return res.status(400).json(payload !== null && payload !== void 0 ? payload : { message: 'Bad Request' });
            }
            const created = yield customer_service_1.default.create(userId, parsed.data);
            return res.status(201).json(created);
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                // Unique constraint failed, likely on email
                return res.status(409).json({ message: 'Conflict: A customer with this email already exists.' });
            }
            return next(err);
        }
    });
}
exports.createCustomer = createCustomer;
function updateCustomer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const parsed = customer_validation_1.updateCustomerSchema.safeParse(req.body || {});
            if (!parsed.success) {
                const payload = zodErrorResponse(parsed.error);
                return res.status(400).json(payload !== null && payload !== void 0 ? payload : { message: 'Bad Request' });
            }
            const updated = yield customer_service_1.default.update(id, parsed.data);
            if (!updated)
                return res.status(404).json({ message: 'Not Found: Resource not found.' });
            return res.json(updated);
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    return res.status(409).json({ message: 'Conflict: A customer with this email already exists.' });
                }
                if (err.code === 'P2025') {
                    return res.status(404).json({ message: 'Not Found: Resource not found.' });
                }
            }
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
            if (err instanceof customer_service_1.ConflictError) {
                return res.status(409).json({ message: err.message });
            }
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
                // Foreign key constraint (safety net)
                return res
                    .status(409)
                    .json({ message: 'Conflict: Customer cannot be deleted because invoices reference it.' });
            }
            return next(err);
        }
    });
}
exports.deleteCustomer = deleteCustomer;
