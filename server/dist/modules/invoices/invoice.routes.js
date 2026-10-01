"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorization_middleware_1 = require("../../middlewares/authorization.middleware");
const invoice_service_1 = __importDefault(require("./invoice.service"));
const invoice_controller_1 = require("./invoice.controller");
const router = (0, express_1.Router)();
// All invoice routes require authentication
router.use(auth_middleware_1.authenticateToken);
router.get('/', invoice_controller_1.listInvoices);
router.get('/:id', (0, authorization_middleware_1.requireOwnership)(invoice_service_1.default.getById), invoice_controller_1.getInvoice);
router.post('/', invoice_controller_1.createInvoice);
router.put('/:id', (0, authorization_middleware_1.requireOwnership)(invoice_service_1.default.getById), invoice_controller_1.updateInvoice);
router.delete('/:id', (0, authorization_middleware_1.requireOwnership)(invoice_service_1.default.getById), invoice_controller_1.deleteInvoice);
exports.default = router;
