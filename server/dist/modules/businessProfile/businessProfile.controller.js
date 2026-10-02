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
const businessProfile_service_1 = __importDefault(require("./businessProfile.service"));
const businessProfile_validation_1 = require("./businessProfile.validation");
function getBusinessProfile(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const profile = yield businessProfile_service_1.default.getProfile(userId);
            return res.json({ profile });
        }
        catch (err) {
            return next(err);
        }
    });
}
function upsertBusinessProfile(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const parseResult = businessProfile_validation_1.upsertBusinessProfileSchema.safeParse(req.body);
            if (!parseResult.success) {
                const issues = parseResult.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
                return res.status(400).json({ message: 'Validation failed', errors: issues });
            }
            const profile = yield businessProfile_service_1.default.upsertProfile(userId, parseResult.data);
            return res.json({ profile });
        }
        catch (err) {
            return next(err);
        }
    });
}
const businessProfileController = {
    getBusinessProfile,
    upsertBusinessProfile,
};
exports.default = businessProfileController;
