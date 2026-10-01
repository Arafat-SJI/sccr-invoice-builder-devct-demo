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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_repository_1 = __importDefault(require("./invoice.repository"));
function listByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return invoice_repository_1.default.findAllByUser(userId);
    });
}
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return invoice_repository_1.default.findById(id);
    });
}
function create(userId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return invoice_repository_1.default.create(Object.assign(Object.assign({}, data), { userId }));
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return invoice_repository_1.default.update(id, data);
    });
}
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return invoice_repository_1.default.remove(id);
    });
}
const invoiceService = {
    listByUser,
    getById,
    create,
    update,
    remove,
};
exports.default = invoiceService;
