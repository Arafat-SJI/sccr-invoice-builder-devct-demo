"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorization_middleware_1 = require("../../middlewares/authorization.middleware");
const customer_service_1 = __importDefault(require("./customer.service"));
const customer_controller_1 = require("./customer.controller");
const router = (0, express_1.Router)();
// All customer routes require authentication
router.use(auth_middleware_1.authenticateToken);
router.get('/', customer_controller_1.listCustomers);
router.get('/:id', (0, authorization_middleware_1.requireOwnership)(customer_service_1.default.getById), customer_controller_1.getCustomer);
router.post('/', customer_controller_1.createCustomer);
router.put('/:id', (0, authorization_middleware_1.requireOwnership)(customer_service_1.default.getById), customer_controller_1.updateCustomer);
router.delete('/:id', (0, authorization_middleware_1.requireOwnership)(customer_service_1.default.getById), customer_controller_1.deleteCustomer);
exports.default = router;
