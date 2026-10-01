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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnership = exports.requireRole = void 0;
/**
 * requireRole enforces that the authenticated user's role is one of the allowed roles.
 * - If no role is present on the request, responds with 401 Unauthorized.
 * - If allowedRoles is empty or the role is not allowed, responds with 403 Forbidden.
 */
function requireRole(allowedRoles) {
    return (req, res, next) => {
        var _a;
        const role = req.role || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role);
        if (!role) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role.' });
        }
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role.' });
        }
        return next();
    };
}
exports.requireRole = requireRole;
/**
 * requireOwnership ensures that the authenticated user owns the resource.
 * - If role is ADMIN, ownership checks are bypassed (admin access).
 * - If userId is missing, responds with 401 Unauthorized.
 * - If resource is not found, responds with 404 Not Found.
 * - If resource.userId !== req.userId, responds with 403 Forbidden.
 */
function requireOwnership(getResourceFn) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const role = req.role || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role);
            const userId = req.userId || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            // Admin bypasses ownership checks
            if (role === 'ADMIN') {
                return next();
            }
            const resourceId = req.params.id;
            if (!resourceId) {
                return res.status(400).json({ message: 'Bad Request: Missing resource id.' });
            }
            const resource = yield getResourceFn(resourceId);
            if (!resource) {
                return res.status(404).json({ message: 'Not Found: Resource not found.' });
            }
            if (resource.userId !== userId) {
                return res.status(403).json({ message: 'Forbidden: Resource ownership mismatch.' });
            }
            return next();
        }
        catch (err) {
            return next(err);
        }
    });
}
exports.requireOwnership = requireOwnership;
