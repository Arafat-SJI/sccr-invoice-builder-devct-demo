"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function getSecret() {
    const secret = env_1.config.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return secret;
}
function generateToken(payload) {
    const secret = getSecret();
    const expiryRaw = env_1.config.JWT_EXPIRY_SECONDS;
    const expiresIn = expiryRaw ? Number(expiryRaw) : 3600;
    return jsonwebtoken_1.default.sign({ id: payload.id, role: payload.role }, secret, {
        expiresIn,
    });
}
exports.generateToken = generateToken;
function verifyToken(token) {
    const secret = getSecret();
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded) || !('role' in decoded)) {
        throw new Error('Invalid token payload');
    }
    return {
        id: decoded.id,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp,
    };
}
exports.verifyToken = verifyToken;
