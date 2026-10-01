"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
const validate = (schema) => (req, res, next) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
        const issues = parseResult.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
        return res.status(400).json({ message: 'Validation failed', errors: issues });
    }
    req.body = parseResult.data;
    return next();
};
exports.validate = validate;
