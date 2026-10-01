"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
function authenticateToken(req, res, next) {
    try {
        const authHeader = (req.headers['authorization'] || req.headers['Authorization']);
        if (!authHeader || typeof authHeader !== 'string') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = parts[1];
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        // Preserve existing user object and also attach top-level userId/role for convenience
        const role = decoded.role === 'ADMIN' || decoded.role === 'USER' ? decoded.role : 'USER';
        req.user = { id: decoded.id, role };
        req.userId = decoded.id;
        req.role = role;
        return next();
    }
    catch (_a) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
exports.authenticateToken = authenticateToken;
