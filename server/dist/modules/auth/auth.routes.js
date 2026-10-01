"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const authorization_middleware_1 = require("../../middlewares/authorization.middleware");
const router = (0, express_1.Router)();
router.post('/register', (0, auth_validation_1.validate)(auth_validation_1.registerSchema), auth_controller_1.register);
router.post('/login', (0, auth_validation_1.validate)(auth_validation_1.loginSchema), auth_controller_1.login);
// Example admin-only route to demonstrate role-based access control
router.get('/admin/ping', auth_middleware_1.authenticateToken, (0, authorization_middleware_1.requireRole)(['ADMIN']), (req, res) => {
    return res.json({ message: 'Admin access granted', user: req.user });
});
exports.default = router;
