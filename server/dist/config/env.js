"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const envCandidates = [
    path_1.default.resolve(process.cwd(), '.env'),
    path_1.default.resolve(process.cwd(), '../.env'),
];
const envPath = envCandidates.find((candidate) => fs_1.default.existsSync(candidate));
if (envPath) {
    dotenv_1.default.config({ path: envPath });
}
else {
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
}
exports.config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY_SECONDS: process.env.JWT_EXPIRY_SECONDS,
};
