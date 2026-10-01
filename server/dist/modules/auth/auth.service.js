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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const auth_repository_1 = require("./auth.repository");
const password_utils_1 = require("../../utils/password.utils");
const jwt_utils_1 = require("../../utils/jwt.utils");
function toSafeUser(user) {
    const _a = user, { passwordHash } = _a, safe = __rest(_a, ["passwordHash"]);
    return safe;
}
exports.authService = {
    // Backward compatible method retained (originally used in controller)
    register: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const created = yield exports.authService.registerUser(data.name, data.email, data.password);
        return created;
    }),
    registerUser: (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const normalizedEmail = email.trim().toLowerCase();
        const existing = yield auth_repository_1.authRepository.findUserByEmail(normalizedEmail);
        if (existing) {
            const err = new Error('Email already in use');
            err.code = 'DUPLICATE_EMAIL';
            throw err;
        }
        const passwordHash = yield (0, password_utils_1.hashPassword)(password);
        const user = yield auth_repository_1.authRepository.createUser({ name: name.trim(), email: normalizedEmail, passwordHash });
        return toSafeUser(user);
    }),
    loginUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const normalizedEmail = email.trim().toLowerCase();
        const user = yield auth_repository_1.authRepository.findUserByEmail(normalizedEmail);
        const invalid = () => {
            const err = new Error('Invalid credentials');
            err.code = 'INVALID_CREDENTIALS';
            return err;
        };
        if (!user) {
            throw invalid();
        }
        if (user.status && String(user.status).toUpperCase() !== 'ACTIVE') {
            throw invalid();
        }
        const ok = yield (0, password_utils_1.comparePassword)(password, user.passwordHash);
        if (!ok) {
            throw invalid();
        }
        const token = (0, jwt_utils_1.generateToken)({ id: String(user.id), role: user.role || 'USER' });
        return { token, user: toSafeUser(user) };
    }),
};
