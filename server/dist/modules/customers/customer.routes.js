"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const customer_controller_1 = require("./customer.controller");
const router = (0, express_1.Router)();
// All customer routes require authentication
router.use(auth_middleware_1.authenticateToken);
router.get('/', customer_controller_1.listCustomers);
router.get('/:id', customer_controller_1.getCustomer); // Ownership handled in service
router.post('/', customer_controller_1.createCustomer);
router.put('/:id', customer_controller_1.updateCustomer); // Ownership handled in service
router.delete('/:id', customer_controller_1.deleteCustomer); // Ownership handled in service
exports.default = router;
