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
exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const user = yield auth_service_1.authService.registerUser(name, email, password);
        res.status(201).json(user);
    }
    catch (error) {
        if (error && error.code === 'DUPLICATE_EMAIL') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(400).json({ message: (error === null || error === void 0 ? void 0 : error.message) || 'Registration failed' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield auth_service_1.authService.loginUser(email, password);
        res.status(200).json(result);
    }
    catch (error) {
        // Always return generic unauthorized for authentication failures
        res.status(401).json({ message: 'Invalid credentials' });
    }
});
exports.login = login;
