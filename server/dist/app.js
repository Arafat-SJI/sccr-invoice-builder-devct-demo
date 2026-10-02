"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middlewares/error.middleware");
const notFound_middleware_1 = require("./middlewares/notFound.middleware");
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const customer_routes_1 = __importDefault(require("./modules/customers/customer.routes"));
const invoice_routes_1 = __importDefault(require("./modules/invoices/invoice.routes"));
const businessProfile_routes_1 = __importDefault(require("./modules/businessProfile/businessProfile.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.config.CORS_ORIGIN }));
app.use(express_1.default.json());
app.use('/api/health', health_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/invoices', invoice_routes_1.default);
app.use('/api/profile', businessProfile_routes_1.default);
// Example protected route to verify auth middleware
app.get('/api/protected', auth_middleware_1.authenticateToken, (req, res) => {
    res.json({ message: 'Access granted', user: req.user });
});
app.use(notFound_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
